import { requireAdmin } from "@/lib/auth-guard"
import { getReachStats, getTopHeroBuilds, getClickStats, getExitPages, getViewTrendData } from "@/lib/analytics-actions"
import AnalyticsDashboardView from "./components/AnalyticsDashboardView"

export const metadata = {
  title: "Analytics | 7K DB",
  description: "View internal tracking analytics"
}

export default async function AnalyticsDashboard() {
  await requireAdmin()
  
  const [reach, growth, conversion, exits, trend] = await Promise.all([
    getReachStats(),
    getTopHeroBuilds(),
    getClickStats(),
    getExitPages(),
    getViewTrendData()
  ])

  const data = { reach, growth, conversion, exits, trend }

  return (
    <AnalyticsDashboardView data={data} />
  )
}
