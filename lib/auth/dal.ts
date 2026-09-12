import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "./session";

/**
 * Data Access Layer entry point for authorization. Centralizing the check
 * here (rather than scattering `getSession()` calls) means every admin page
 * and Server Action can share one source of truth, memoized per request.
 */
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.username) {
    redirect("/admin/login");
  }

  return { isAuth: true, username: session.username };
});

/**
 * Same check, but returns `null` instead of redirecting. Useful in places
 * (like the login page) that need to know the auth state without forcing a
 * redirect loop.
 */
export const getOptionalSession = cache(async () => {
  const session = await getSession();
  if (!session?.username) return null;
  return { username: session.username };
});
