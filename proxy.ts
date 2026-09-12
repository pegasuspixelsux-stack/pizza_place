import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Optimistic auth check that runs before every request to `/admin/*`. This
 * only reads the signed session cookie (no data access), so it's safe to run
 * on every route. Server Actions and pages still re-verify the session
 * themselves (see `lib/auth/dal.ts`) — this is just a fast, early redirect.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isProtectedRoute = pathname.startsWith("/admin") && !isLoginRoute;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(token);

  if (isProtectedRoute && !session?.username) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && session?.username) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
