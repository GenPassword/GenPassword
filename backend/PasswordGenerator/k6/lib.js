import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:5012';
export const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'TestPass123!';
export const USER_COUNT = Number(__ENV.USER_COUNT || 200);

export const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

/** 10 → 25 → 50 → 100 → 200 VUs, затем ramp-down */
export const stressStages = [
  { duration: '30s', target: 10 },
  { duration: '1m', target: 25 },
  { duration: '1m', target: 50 },
  { duration: '1m', target: 100 },
  { duration: '1m', target: 200 },
  { duration: '30s', target: 0 },
];

export const defaultThresholds = {
  http_req_duration: ['p(95)<1000'],
  http_req_failed: ['rate<0.05'],
  checks: ['rate>0.95'],
};

export function authHeaders(token) {
  return {
    ...jsonHeaders,
    Authorization: `Bearer ${token}`,
  };
}

export function getSession(data, vu) {
  if (!data.sessions || data.sessions.length === 0) {
    return null;
  }
  return data.sessions[(vu - 1) % data.sessions.length];
}

function registerUser(email, password) {
  const response = http.post(
    `${BASE_URL}/api/auth/register`,
    JSON.stringify({ email, password }),
    { headers: jsonHeaders, tags: { name: 'POST /api/auth/register' } },
  );

  check(response, {
    'register: status is 200 or 409': (r) => r.status === 200 || r.status === 409,
  });
}

function loginUser(email, password) {
  const response = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: jsonHeaders, tags: { name: 'POST /api/auth/login' } },
  );

  const ok = check(response, {
    'login: status is 200': (r) => r.status === 200,
    'login: has JWT token': (r) => {
      try {
        const body = r.json();
        return typeof body.token === 'string' && body.token.length > 0;
      } catch {
        return false;
      }
    },
  });

  if (!ok) {
    return null;
  }

  return response.json('token');
}

/**
 * Регистрация + login один раз в setup().
 * Токены переиспользуются в итерациях — auth не попадает в метрики нагрузки.
 */
export function setupAuthSessions(userCount = USER_COUNT) {
  const sessions = [];

  for (let i = 1; i <= userCount; i++) {
    const email = `k6-user-${i}@test.local`;
    registerUser(email, TEST_PASSWORD);

    const token = loginUser(email, TEST_PASSWORD);
    if (token) {
      sessions.push({ email, token, userIndex: i });
    }
  }

  return { sessions };
}

export function savePassword(token, saveId, password, description) {
  const response = http.post(
    `${BASE_URL}/api/usersavedpassword/save`,
    JSON.stringify({ id: saveId, password, description }),
    { headers: authHeaders(token), tags: { name: 'POST /api/usersavedpassword/save' } },
  );

  return response.status === 200;
}

export function seedSavedPasswords(sessions, itemsPerUser = 3) {
  for (const session of sessions) {
    for (let i = 1; i <= itemsPerUser; i++) {
      savePassword(
        session.token,
        session.userIndex * 100 + i,
        `seed-password-${session.userIndex}-${i}`,
        `seed vu${session.userIndex} item${i}`,
      );
    }
  }
}

export function generatePasswordPayload() {
  return JSON.stringify({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeDigits: true,
    includeSpecial: true,
    excludeSimilar: false,
    noRepeats: false,
    minDigits: 1,
    minSpecial: 1,
  });
}

export function passphrasePayload() {
  return JSON.stringify({
    wordCount: 4,
    wordCase: 0,
    separator: '-',
  });
}