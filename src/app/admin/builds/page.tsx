import fs from "fs"
import path from "path"
import { getHeroesMetadata } from "@/lib/build-db"
import { parseHeroDetails } from "@/lib/hero-utils"
import BuildManagerView from "@/components/admin/builds/BuildManagerView"

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Hero Builds Management | Admin',
    description: 'Configure and optimize hero equipment sets and skill priorities.'
}

/**
 * AdminBuildsPage - Server Component
 * Handles scanning the filesystem and fetching metadata for hero builds.
 */
export default async function AdminBuildsPage() {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let heroes = []

    try {
        if (!fs.existsSync(heroesDir)) {
            await fs.promises.mkdir(heroesDir, { recursive: true })
        }

        const [files, metadata] = await Promise.all([
            fs.promises.readdir(heroesDir),
            getHeroesMetadata()
        ])

        heroes = files
            .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
            .map((file) => {
                const details = parseHeroDetails(file)
                if (!details || details.grade === "unknown") return null

                return {
                    ...details,
                    is_new_hero: metadata[details.slug]?.is_new_hero || false,
                    sort_order: metadata[details.slug]?.sort_order || 0
                }
            })
            .filter(Boolean)
            .sort((a, b) => {
                // Priority 0: Specified sort order
                if (a.sort_order !== b.sort_order) {
                    if (a.sort_order === 0) return 1
                    if (b.sort_order === 0) return -1
                    return a.sort_order - b.sort_order
                }

                // Priority 1: New Heroes first
                if (a.is_new_hero !== b.is_new_hero) return b.is_new_hero ? 1 : -1

                // Priority 2: Grade ranking (L++ > L+ > L > R)
                const gradesOrder = { "l++": 4, "l+": 3, "l": 2, "r": 1 }
                const rankA = gradesOrder[a.grade] || 0
                const rankB = gradesOrder[b.grade] || 0
                if (rankA !== rankB) return rankB - rankA

                // Priority 3: Alphabetical by filename
                return a.filename.localeCompare(b.filename)
            })

    } catch (error) {
        console.error("[ADMIN_BUILDS] Error loading hero registry:", error)
    }

    return (
        <main>
            <BuildManagerView heroes={heroes} />
        </main>
    )
}
