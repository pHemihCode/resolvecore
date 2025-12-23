// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET, 
  });

  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/dashboard/:path*", "/ticket/:path*"],
};