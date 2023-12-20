import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // console.log(req.nextUrl.pathname, "Path");
    // console.log(req.nextauth.token, "Token");

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token.role !== "Admin"
    ) {
      const redirectUrl = new URL("/not-found", req.url);
      return NextResponse.rewrite(redirectUrl);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
  {
    pages: {
      signIn: "/login",
      signOut: "/login",
      error: "/not-found",
    },
  }
);

export const config = { matcher: ["/", "/admin", "/explore", "/explore/(.*)", "/likes", "/channel", "/channel/(.*)", "/subscription_channel", "/myprofile", "/myprofile/(.*)"] };
