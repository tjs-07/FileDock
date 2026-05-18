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

  const protectedRoutes = [
    "/dashboard",
    "/category",
    "/files",
    "/folders",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

  // Protect routes
  if (isProtected) {

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

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/category/:path*",
    "/files/:path*",
    "/folders/:path*",
  ],
};