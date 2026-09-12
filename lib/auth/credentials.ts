import "server-only";

import bcrypt from "bcryptjs";

/**
 * Verifies admin credentials against environment variables.
 *
 * Set `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` (a bcrypt hash — generate
 * one with `npm run hash-password -- "your-password"`) in your environment.
 * See `.env.example`.
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !expectedPasswordHash) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be set. See .env.example."
    );
  }

  if (username !== expectedUsername) {
    // Still run a hash comparison so failed lookups take a similar amount
    // of time whether or not the username matched (avoids leaking via
    // response-time side channels).
    await bcrypt.compare(password, expectedPasswordHash);
    return false;
  }

  return bcrypt.compare(password, expectedPasswordHash);
}
