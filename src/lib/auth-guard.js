import { cookies } from "next/headers"
import { validateSession } from "./session"

/**
 * Server Component / Action helper to require admin authentication.
 * Throws an error if not authenticated.
 */
export async function requireAdmin() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value

    if (!(await validateSession(token))) {
        throw new Error("Unauthorized: Admin access required")
    }
    
    return true
}
