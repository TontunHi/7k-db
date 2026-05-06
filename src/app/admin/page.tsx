import { getAdminUser, requireAdmin } from "@/lib/auth-guard"
import { getDashboardStats } from "@/lib/admin-dashboard-actions"
import { getRecentUpdates } from "@/lib/log-actions"
import AdminDashboardView from "./AdminDashboardView"

export const metadata = {
    title: "Admin Command Center | 7K Database",
    description: "Manage all aspects of the 7K Database."
}

export default async function AdminDashboard() {
    // Auth Guard
    await requireAdmin()
    const user = await getAdminUser()
    
    // Fetch Data
    const [stats, recentLogs] = await Promise.all([
        getDashboardStats(),
        getRecentUpdates(15)
    ])

    return (
        <AdminDashboardView 
            user={user} 
            stats={stats} 
            recentLogs={recentLogs} 
        />
    )
}
