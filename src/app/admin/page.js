import Link from "next/link"
import { FileImage, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                    href="/admin/builds"
                    className="group p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-[#FFD700] transition-colors"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-gray-800 group-hover:bg-[#FFD700]/10 transition-colors">
                            <FileImage className="w-6 h-6 text-[#FFD700]" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#FFD700] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Manage Builds</h3>
                    <p className="text-sm text-gray-400">Upload, delete, and organize hero build images.</p>
                </Link>
            </div>
        </div>
    )
}
