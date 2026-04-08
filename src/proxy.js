import { NextResponse } from "next/server"
import { validateSession } from "./lib/session"

export async function proxy(request) {
    const { pathname } = request.nextUrl
    
    // Check if accessing admin or api/assets routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/assets")) {
        const sessionToken = request.cookies.get("admin_session")?.value

        if (!(await validateSession(sessionToken))) {
            // Check if it's an API request
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/api/assets/:path*"],
}
