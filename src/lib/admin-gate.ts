// Demo-only organizer password gate for the hackathon prototype.
// Real access control is enforced server-side by organizer roles and RLS;
// this gate only guards the admin UI demonstration flow.
export const DEMO_ADMIN_PASSWORD = '123';

const gateKey = 'courtside-admin-unlocked';

export const checkAdminPassword = (input: string) => input === DEMO_ADMIN_PASSWORD;

export function isAdminUnlocked(): boolean {
  try { return sessionStorage.getItem(gateKey) === '1'; } catch { return false; }
}

export function unlockAdmin(password: string): boolean {
  if (!checkAdminPassword(password)) return false;
  try { sessionStorage.setItem(gateKey, '1'); } catch { /* In-memory unlock still applies. */ }
  return true;
}

export function lockAdmin() {
  try { sessionStorage.removeItem(gateKey); } catch { /* Lock still applies in memory. */ }
}
