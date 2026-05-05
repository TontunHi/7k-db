import { requireAdmin } from "@/lib/auth-guard"
import { getPaginatedUpdates } from "@/lib/log-actions"
import { Marker, ActionLabel } from "@/app/admin/components/AdminEditorial"
import Link from "next/link"

export const metadata = {
    title: "Audit Logs | 7K Database",
    description: "System-wide tracking of content updates and administrative actions."
}

export default async function AuditLogsPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
    await requireAdmin()
    
    const params = await searchParams
    const page = parseInt(params.page || "1", 10)
    const type = params.type || "all"
    
    const { logs, total, totalPages } = await getPaginatedUpdates({ page, type, limit: 30 })

    const types = [
        "all", "RAID", "STAGE", "CASTLE_RUSH", "BUILD", "TIERLIST", "USER", "ARENA", "TOTAL_WAR", "GUILD_WAR"
    ]

    const typeColors = {
        RAID: "text-red-500 bg-red-500/10 border-red-500/20",
        STAGE: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        CASTLE_RUSH: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        BUILD: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        TIERLIST: "text-pink-500 bg-pink-500/10 border-pink-500/20",
        USER: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        SYSTEM: "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }

    const actionIcons = {
        CREATE: "bg-emerald-500",
        UPDATE: "bg-blue-500",
        DELETE: "bg-red-500",
        LOGIN: "bg-indigo-500"
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                        <Marker color="bg-red-500" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">System Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tight transform -skew-x-6">
                        Audit <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Logistics</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Comprehensive tracking of every modification, creation, and system event within the database.
                    </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 uppercase text-[9px] mb-1">Total Entries</span>
                            <span className="text-white text-lg font-black">{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 p-2 bg-black/40 border border-white/5 rounded-[1.5rem] backdrop-blur-xl">
                {types.map((t) => (
                    <Link
                        key={t}
                        href={`/admin/logs?type=${t}`}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            type === t 
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        {t.replace('_', ' ')}
                    </Link>
                ))}
            </div>

            {/* Logs Table */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Administrator</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Action & Message</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-[10px] font-black text-gray-400">
                                                ID
                                            </div>
                                            <span className="text-xs font-bold text-white uppercase tracking-wide">{log.admin_name || "System"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border uppercase tracking-widest ${typeColors[log.content_type] || "text-gray-400 bg-gray-500/10 border-gray-500/20"}`}>
                                            {log.content_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${actionIcons[log.action_type] || "bg-gray-500"}`} />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.action_type} &bull; {log.target_name}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium">{log.message}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{log.display_time}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {logs.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="text-[4rem] font-black opacity-5 italic mb-4">NO_RECORDS</div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">No records found for this category</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Showing Page {page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            {page > 1 && (
                                <Link 
                                    href={`/admin/logs?type=${type}&page=${page - 1}`}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    <ActionLabel label="PREVIOUS" size="text-[9px]" />
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link 
                                    href={`/admin/logs?type=${type}&page=${page + 1}`}
                                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    <ActionLabel label="NEXT" size="text-[9px]" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex justify-start">
                <Link 
                    href="/admin"
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                    <ActionLabel label="BACK TO COMMAND" size="text-[10px]" color="text-gray-500" />
                </Link>
            </div>
        </div>
    )
}
