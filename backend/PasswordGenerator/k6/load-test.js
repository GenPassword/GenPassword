/**
 * Алиас для generate-test.js (обратная совместимость).
 * Рекомендуется запускать 3 теста отдельно — см. generate-test.js, auth-write-test.js, read-test.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  defaultThresholds,
  generatePasswordPayload,
  jsonHeaders,
  passphrasePayload,
  stressStages,
} from './lib.js';

export const options = {
  stages: stressStages,
  thresholds: defaultThresholds,
};

export default function () {
  const generateResponse = http.post(
    `${BASE_URL}/api/password/generate`,
    generatePasswordPayload(),
    { headers: jsonHeaders, tags: { name: 'POST /api/password/generate' } },
  );

  check(generateResponse, {
    'generate: status is 200': (r) => r.status === 200,
    'generate: has password': (r) => {
      try {
        const body = r.json();
        return typeof body.password === 'string' && body.password.length > 0;
      } catch {
        return false;
      }
    },
  });

  const passphraseResponse = http.post(
    `${BASE_URL}/api/password/generate-from-words`,
    passphrasePayload(),
    { headers: jsonHeaders, tags: { name: 'POST /api/password/generate-from-words' } },
  );

  check(passphraseResponse, {
    'passphrase: status is 200': (r) => r.status === 200,
    'passphrase: has password': (r) => {
      try {
        const body = r.json();
        return typeof body.password === 'string' && body.password.length > 0;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);
}
