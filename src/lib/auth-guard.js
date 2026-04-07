import { cookies } from "next/headers"
import { verifyToken } from "./session"
import pool, { initDB } from "./db"

/**
 * Get the current admin user from session
 */
export async function getAdminUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    
    const userId = await verifyToken(token)
    if (!userId) return null

    await initDB()
    const [rows] = await pool.query("SELECT id, username, role, permissions FROM users WHERE id = ?", [userId])
    
    if (rows.length === 0) return null
    return rows[0]
}

/**
 * Server Component / Action helper to require admin authentication.
 * Throws an error if not authenticated or lacks permission.
 * @param {string} permission - Optional specific module permission (e.g., 'MANAGE_RAIDS')
 */
export async function requireAdmin(permission = null) {
    const user = await getAdminUser()
    
    if (!user) {
        throw new Error("Unauthorized: Admin access required")
    }

    // Role-based logic
    if (user.role === 'super_admin') return true

    // Permission-based logic for 'admin' role
    if (permission) {
        const perms = user.permissions || []
        if (!perms.includes(permission) && !perms.includes('*')) {
            throw new Error(`Forbidden: Missing permission ${permission}`)
        }
    }
    
    return true
}
