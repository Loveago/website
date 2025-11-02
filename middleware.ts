import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Additional per-request logic can go here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (!token) return false;
        if (pathname.startsWith("/admin")) {
          return token.role === "ADMIN";
        }
        return true; // logged in for other matched routes
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
