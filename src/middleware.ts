import { NextRequest, NextResponse } from "next/server";

// Routes that do NOT require authentication
const PUBLIC_PATHS = [
    "/login",
    "/api/auth/login",
    "/api/auth/logout",
];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isStaticAsset(pathname: string): boolean {
    return (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.endsWith(".ico") ||
        pathname.endsWith(".png") ||
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".jpeg") ||
        pathname.endsWith(".svg") ||
        pathname.endsWith(".webp") ||
        pathname.endsWith(".css") ||
        pathname.endsWith(".js") ||
        pathname.endsWith(".woff") ||
        pathname.endsWith(".woff2") ||
        pathname.endsWith(".ttf") ||
        pathname.endsWith(".otf")
    );
}

function isAuthenticated(request: NextRequest): boolean {
    const sessionToken = request.cookies.get("studio_session")?.value;
    const sessionExpires = request.cookies.get("studio_session_expires")?.value;

    return !!(
        sessionToken &&
        sessionExpires &&
        Date.now() <= Number(sessionExpires)
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow static assets through without auth check
    if (isStaticAsset(pathname)) {
        return NextResponse.next();
    }

    // Allow public paths through without auth check
    if (isPublicPath(pathname)) {
        // If already authenticated and trying to access /login, redirect to home
        if (pathname === "/login" && isAuthenticated(request)) {
            return NextResponse.redirect(new URL("/cases", request.url));
        }
        return NextResponse.next();
    }

    // For all other routes, require authentication
    if (!isAuthenticated(request)) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
