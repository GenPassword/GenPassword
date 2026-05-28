import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  BASE_URL,
  defaultThresholds,
  stressStages,
  generatePasswordPayload,
  jsonHeaders,
  passphrasePayload,
} from './lib.js';

/** A) Pure API performance — без auth, без БД */
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
