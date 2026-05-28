import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  authHeaders,
  defaultThresholds,
  getSession,
  setupAuthSessions,
  stressStages,
} from './lib.js';

/** B) Auth + DB write — login только в setup(), итерации только save */
export const options = {
  stages: stressStages,
  thresholds: defaultThresholds,
};

export function setup() {
  return setupAuthSessions();
}

export default function (data) {
  const session = getSession(data, __VU);
  if (!session) {
    return;
  }

  const saveId = session.userIndex * 10000 + __ITER;
  const payload = JSON.stringify({
    id: saveId,
    password: `k6-write-${session.userIndex}-${__ITER}`,
    description: `k6 write vu${__VU} iter${__ITER}`,
  });

  const response = http.post(`${BASE_URL}/api/usersavedpassword/save`, payload, {
    headers: authHeaders(session.token),
    tags: { name: 'POST /api/usersavedpassword/save' },
  });

  check(response, {
    'save: status is 200': (r) => r.status === 200,
    'save: success message': (r) => {
      try {
        const body = r.json();
        return typeof body.message === 'string' && body.message.length > 0;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);
}
