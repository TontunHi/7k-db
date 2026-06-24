import Sidebar from "@/components/admin/Sidebar"
import { getAdminUser, requireAdmin } from "@/lib/auth-guard"

export default async function AdminLayout({ children }) {
    // Standard auth check
    await requireAdmin()
    
    // Get user details for UI filtering
    const user = await getAdminUser()

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <Sidebar user={user} />

            {/* Main Content */}
            <main className="flex-1 min-h-screen p-5 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
