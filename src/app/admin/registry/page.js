import { getFullRegistryData } from "@/lib/registry-actions"
import RegistryDashboardView from "./components/RegistryDashboardView"

export const metadata = {
    title: "Database Registry | 7K Admin",
    description: "Manage Heroes, Pets and Items metadata"
}

export default async function RegistryPage() {
    const data = await getFullRegistryData()

    return (
        <RegistryDashboardView initialData={data} />
    )
}
