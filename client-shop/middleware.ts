import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/"];
const AUTH_REDIRECT = "/home";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    
    console.log("[middleware]", pathname, "token:", !!accessToken);
    
    if (accessToken && PUBLIC_PATHS.some(p => pathname === p)) {
        return NextResponse.redirect(new URL(AUTH_REDIRECT, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)",
    ],
};