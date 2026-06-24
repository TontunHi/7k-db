import { getFullRegistryData } from "@/lib/registry-actions"
import RegistryDashboardView from "./components/RegistryDashboardView"
import { requireAdmin } from "@/lib/auth-guard"

export const metadata = {
    title: "Database Registry | 7K Admin",
    description: "Manage Heroes, Pets and Items metadata"
}

export default async function RegistryPage() {
    await requireAdmin('*')
    const data = await getFullRegistryData()

    return (
        <RegistryDashboardView initialData={data} />
    )
}
