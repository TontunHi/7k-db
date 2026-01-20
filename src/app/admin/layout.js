import Link from "next/link"
import { LayoutDashboard, LogOut, FileImage, FileText } from "lucide-react"
import { logout } from "@/lib/actions"

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-900/30 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <span className="text-xl font-bold text-[#FFD700]">7K Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/blog"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        Manage Blog
                    </Link>
                    <Link
                        href="/admin/builds"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <FileImage className="w-5 h-5" />
                        Manage Builds
                    </Link>
                    <Link
                        href="/admin/tierlist"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Manage Tierlist
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <form action={logout}>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-colors">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
