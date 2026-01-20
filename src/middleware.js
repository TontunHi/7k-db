import { NextResponse } from "next/server"

export function middleware(request) {
    // Check if accessing admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const session = request.cookies.get("admin_session")

        if (!session || session.value !== "true") {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/admin/:path*",
}
