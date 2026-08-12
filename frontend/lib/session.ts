/**
 * Who the app thinks you are.
 *
 * There is no auth yet — every RPC takes an explicit p_user_id, so this is
 * the single source of that value. When auth lands, this file becomes a
 * wrapper around supabase.auth.getUser() and nothing else has to change.
 *
 * ⚠️  DEMO ONLY. This is a real row in the `users` table, seeded for the
 * hackathon. Do not ship an app that trusts a hardcoded identity.
 */

export const DEMO_USER_ID = "833ba400-ba22-4c6c-a50a-6f7d6dee4516";

export function getCurrentUserId(): string {
  return DEMO_USER_ID;
}