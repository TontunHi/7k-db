import AssetManagerView from "./components/AssetManagerView"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata = {
    title: "Asset Management | Admin",
    description: "Upload and manage hero, pet, and item assets."
}

/**
 * AdminAssetsPage - Asset Management Entry Point
 * Refactored for clean architecture while maintaining original processes.
 */
export default async function AdminAssetsPage() {
    await requireAdmin('MANAGE_ASSETS')
    return (
        <AssetManagerView />
    )
}
