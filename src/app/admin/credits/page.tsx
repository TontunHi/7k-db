import CreditsDashboardView from "./components/CreditsDashboardView"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata = {
    title: "Credits Management | Admin",
    description: "Manage credits for contributors."
}

/**
 * CreditsAdminPage - Credits Management Entry Point
 * Refactored for clean architecture while maintaining original processes.
 */
export default async function CreditsAdminPage() {
    await requireAdmin('MANAGE_CREDITS')
    return (
        <CreditsDashboardView />
    )
}
