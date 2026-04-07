import Sidebar from "@/components/admin/Sidebar"
import { getAdminUser, requireAdmin } from "@/lib/auth-guard"

export default async function AdminLayout({ children }) {
    // Standard auth check
    await requireAdmin()
    
    // Get user details for UI filtering
    const user = await getAdminUser()

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row">
            <Sidebar user={user} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                {children}
            </main>
        </div>
    )
}
