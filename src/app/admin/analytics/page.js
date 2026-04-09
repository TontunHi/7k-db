import { getAdminUser, requireAdmin } from "@/lib/auth-guard"
import { getReachStats, getTopHeroBuilds, getClickStats, getExitPages } from "@/lib/analytics-actions"
import { BarChart3, Users, MousePointerClick, TrendingUp, Hand, MousePointer2 } from "lucide-react"
import AnalyticsFilterTable from "@/components/analytics/AnalyticsFilterTable"

export const metadata = {
  title: "Analytics | 7K DB",
  description: "View internal tracking analytics"
}

export default async function AnalyticsDashboard() {
  await requireAdmin()
  const user = await getAdminUser()
  
  const [reach, growth, conversion, exits] = await Promise.all([
    getReachStats(),
    getTopHeroBuilds(),
    getClickStats(),
    getExitPages()
  ])

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-black p-8 md:p-12 shadow-[0_0_30px_rgba(59,130,246,0.05)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3B82F608_1px,transparent_1px),linear-gradient(to_bottom,#3B82F608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-500 opacity-[0.05] rounded-full blur-[100px]" />
        
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <BarChart3 className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight italic uppercase transform -skew-x-6">
              Internal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Analytics</span>
            </h1>
            <p className="text-sm font-light text-gray-500 tracking-wide mt-2">
              Privacy-first internal metrics to measure your success.
            </p>
          </div>
        </div>
      </div>

      {/* Highlights / KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* PV */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-sm uppercase font-bold tracking-widest text-gray-500">Total Page Views</h2>
          <p className="text-4xl font-black text-white mt-4">{reach.pv.toLocaleString()}</p>
        </div>

        {/* UV */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <Users className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-sm uppercase font-bold tracking-widest text-gray-500">Unique Visitors</h2>
          <p className="text-4xl font-black text-white mt-4">{reach.uv.toLocaleString()}</p>
        </div>

        {/* Clicks */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <MousePointerClick className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-sm uppercase font-bold tracking-widest text-gray-500">Ad / Link Clicks</h2>
          <p className="text-4xl font-black text-white mt-4">{conversion.totalClicks.toLocaleString()}</p>
        </div>

        {/* CTR */}
        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-sm uppercase font-bold tracking-widest text-gray-500">Estimated CTR</h2>
          <p className="text-4xl font-black text-white mt-4">{conversion.ctr}%</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Hero Builds */}
        <div className="rounded-2xl bg-[#0a0a0a] border border-gray-800 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
               <Users className="w-4 h-4 text-pink-400" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-wide uppercase italic">Top 10 Hero Builds</h2>
          </div>
          <div className="p-0">
             {growth.length > 0 ? (
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-900 text-gray-400 text-xs tracking-wider uppercase">
                     <th className="p-4 font-semibold">Page Path</th>
                     <th className="p-4 font-semibold text-right">Views</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300">
                   {growth.map((item, idx) => (
                     <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                       <td className="p-4 font-medium">{item.page_path}</td>
                       <td className="p-4 text-right font-bold text-white">{item.views.toLocaleString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <div className="p-8 text-center text-gray-500">No data available yet.</div>
             )}
          </div>
        </div>

        {/* Top Exit Pages */}
        <div className="rounded-2xl bg-[#0a0a0a] border border-gray-800 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
               <Hand className="w-4 h-4 text-red-400" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-wide uppercase italic">Top Exit Pages</h2>
          </div>
          <div className="p-0">
             {exits.length > 0 ? (
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-900 text-gray-400 text-xs tracking-wider uppercase">
                     <th className="p-4 font-semibold">Page Path</th>
                     <th className="p-4 font-semibold text-right">Exits</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300">
                   {exits.map((item, idx) => (
                     <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                       <td className="p-4 font-medium">{item.page_path}</td>
                       <td className="p-4 text-right font-bold text-white">{item.exits.toLocaleString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             ) : (
               <div className="p-8 text-center text-gray-500">No data available yet.</div>
             )}
          </div>
        </div>
      </div>
      
      {/* Link Clicks Breakdown */}
      <div className="rounded-2xl bg-[#0a0a0a] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
             <MousePointer2 className="w-4 h-4 text-amber-400" />
           </div>
           <h2 className="text-xl font-bold text-white tracking-wide uppercase italic">Click Conversion Breakdown</h2>
        </div>
        <div className="p-0">
           {conversion.clicksByLink.length > 0 ? (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-900 text-gray-400 text-xs tracking-wider uppercase">
                   <th className="p-4 font-semibold">Link ID</th>
                   <th className="p-4 font-semibold">Destination URL</th>
                   <th className="p-4 font-semibold text-right">Clicks</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-800/50 text-sm text-gray-300">
                 {conversion.clicksByLink.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                     <td className="p-4 font-medium text-amber-400">{item.link_id || 'N/A'}</td>
                     <td className="p-4 font-mono text-xs">{item.link_url}</td>
                     <td className="p-4 text-right font-bold text-white">{item.clicks.toLocaleString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           ) : (
             <div className="p-8 text-center text-gray-500">No clicks recorded yet.</div>
           )}
        </div>
      </div>

      {/* Custom Filter Data Table */}
      <AnalyticsFilterTable />

    </div>
  )
}
