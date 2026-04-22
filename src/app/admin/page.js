import { getAdminUser, requireAdmin } from "@/lib/auth-guard"
import { getDashboardStats } from "@/lib/admin-dashboard-actions"
import { getRecentUpdates } from "@/lib/log-actions"
import AdminDashboardView from "./AdminDashboardView"

export const metadata = {
    title: "Admin Command Center | 7K Database",
    description: "Manage all aspects of the 7K Database."
}

/**
 * AdminDashboard - Server Component
 * Responsible for authentication and data fetching.
 */
export default async function AdminDashboard() {
    // 1. Authentication & Guarding
    await requireAdmin()
    const user = await getAdminUser()
    
    // 2. Data Fetching
    const [stats, recentLogs] = await Promise.all([
        getDashboardStats(),
        getRecentUpdates(6)
    ])

    // 3. Render View (Client Component)
    return (
        <AdminDashboardView 
            user={user} 
            stats={stats} 
            recentLogs={recentLogs} 
        />
    )
}
