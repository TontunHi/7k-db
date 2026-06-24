import MessagesDashboardView from "./components/MessagesDashboardView"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata = {
    title: "Messages Management | Admin",
    description: "View and manage user messages."
}

/**
 * AdminMessagesPage - Message Management Entry Point
 * Refactored for clean architecture while maintaining original processes.
 */
export default async function AdminMessagesPage() {
    await requireAdmin('MANAGE_MESSAGES')
    return (
        <MessagesDashboardView />
    )
}
