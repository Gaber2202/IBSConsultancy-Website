import 'server-only';
import crypto from 'crypto';

const COOKIE_NAME = 'ibs_admin_session';
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.AUTH_SECRET || 'dev-insecure-secret-change-me';
}

/** Create a signed session token: base64(payload).hmac */
export function createSessionToken(username: string): string {
  const payload = JSON.stringify({ u: username, exp: Date.now() + MAX_AGE * 1000 });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return false;
  const expected = crypto.createHmac('sha256', secret()).update(b64).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'admin';
  const uOk = safeEqual(username, expectedUser);
  const pOk = safeEqual(password, expectedPass);
  return uOk && pOk;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export const authCookie = { name: COOKIE_NAME, maxAge: MAX_AGE };
