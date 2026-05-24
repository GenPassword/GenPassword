import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  authHeaders,
  defaultThresholds,
  getSession,
  seedSavedPasswords,
  setupAuthSessions,
  stressStages,
} from './lib.js';

/** C) Read heavy — login только в setup(), итерации только getSaves */
export const options = {
  stages: stressStages,
  thresholds: defaultThresholds,
};

export function setup() {
  const data = setupAuthSessions();
  seedSavedPasswords(data.sessions, 5);
  return data;
}

export default function (data) {
  const session = getSession(data, __VU);
  if (!session) {
    return;
  }

  const response = http.get(`${BASE_URL}/api/usersavedpassword/getSaves`, {
    headers: authHeaders(session.token),
    tags: { name: 'GET /api/usersavedpassword/getSaves' },
  });

  check(response, {
    'get saves: status is 200': (r) => r.status === 200,
    'get saves: returns array': (r) => {
      try {
        const body = r.json();
        return Array.isArray(body.saves);
      } catch {
        return false;
      }
    },
    'get saves: has seeded data': (r) => {
      try {
        const body = r.json();
        return body.saves.length >= 1;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);
}
