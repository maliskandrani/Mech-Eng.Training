import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ROLE_PREFIX: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  TRAINER: "/dashboard/trainer",
  STUDENT: "/dashboard/student",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  if (!user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(ROLE_PREFIX[user.role] ?? "/", req.nextUrl.origin));
  }

  const allowedPrefix = ROLE_PREFIX[user.role];
  const isAdmin = user.role === "ADMIN";
  if (!isAdmin && allowedPrefix && !pathname.startsWith(allowedPrefix)) {
    return NextResponse.redirect(new URL(allowedPrefix, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
