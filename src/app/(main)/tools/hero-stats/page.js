import { getFullRegistryData } from "@/lib/registry-actions"
import HeroStatsBuilder from "@/components/tools/HeroStatsBuilder"

export const metadata = {
    title: "Hero Stats Builder | 7K DB",
    description: "Simulate and optimize your hero stats with items, potential, and more."
}

export default async function HeroStatsPage() {
    const { heroes, items } = await getFullRegistryData()
    
    return (
        <main className="min-h-screen">
            <HeroStatsBuilder heroes={heroes} items={items} />
        </main>
    )
}
