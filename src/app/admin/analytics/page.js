import { requireAdmin } from "@/lib/auth-guard"
import { getReachStats, getTopHeroBuilds, getClickStats, getExitPages } from "@/lib/analytics-actions"
import AnalyticsDashboardView from "./components/AnalyticsDashboardView"

export const metadata = {
  title: "Analytics | 7K DB",
  description: "View internal tracking analytics"
}

export default async function AnalyticsDashboard() {
  await requireAdmin()
  
  const [reach, growth, conversion, exits] = await Promise.all([
    getReachStats(),
    getTopHeroBuilds(),
    getClickStats(),
    getExitPages()
  ])

  const data = { reach, growth, conversion, exits }

  return (
    <AnalyticsDashboardView data={data} />
  )
}
