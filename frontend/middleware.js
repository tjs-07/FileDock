import {
  NextResponse,
} from "next/server";

import {
  verifyToken,
} from "@/lib/auth";

export function middleware(req) {

  const token =
    req.cookies.get(
      "token"
    )?.value;

  // Protect dashboard
  if (
    req.nextUrl.pathname.startsWith(
      "/dashboard"
    )
  ) {

    if (!token) {

      return NextResponse.redirect(
        new URL(
          "/login",
          req.url
        )
      );
    }

    try {

      verifyToken(token);

    } catch (error) {

      return NextResponse.redirect(
        new URL(
          "/login",
          req.url
        )
      );
    }
  }

  return NextResponse.next();
}