import fs from "fs"
import path from "path"
import { Suspense } from "react"
import BuildView from "@/components/build/BuildView"
import { getHeroesMetadata } from "@/lib/build-db"
import { Loader2 } from "lucide-react"

export async function generateMetadata({ searchParams: searchParamsPromise }) {
    const searchParams = await searchParamsPromise
    const heroSlug = searchParams.hero
    const bid = searchParams.bid || 0

    if (heroSlug) {
        // Simple name cleanup for title
        const name = heroSlug.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/_/g, " ")
        const capitalizedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        
        return {
            title: `${capitalizedName} Best Build`,
            description: `Optimal equipment, accessories, and stats for ${capitalizedName}. Shared build from 7K DB community.`,
            openGraph: {
                title: `${capitalizedName} | 7K DB Build`,
                description: `Check out the best equipment and stats for ${capitalizedName} in Seven Knights Rebirth.`,
                images: [
                    {
                        url: `/api/og/build?hero=${heroSlug}&bid=${bid}`,
                        width: 1200,
                        height: 630,
                        alt: `${capitalizedName} Build Preview`,
                    }
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${capitalizedName} Build Guide`,
                description: `Best build for ${capitalizedName} in 7K Rebirth.`,
                images: [`/api/og/build?hero=${heroSlug}&bid=${bid}`],
            }
        }
    }

    return {
        title: "Hero Builds",
        description: "Explore the best-recommended equipment and accessory builds for every legendary and rare hero in Seven Knights Rebirth.",
    }
}

// Logic to parse filename to grade
// Filenames: l++_Name.png, l+_Name.png, l_Name.png, r_Name.png
function getGradeFromFilename(filename) {
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

export const dynamic = 'force-dynamic' 

export default async function BuildPage({ searchParams: searchParamsPromise }) {
    const searchParams = await searchParamsPromise
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let heroes = []

    try {
        const [files, metadata] = await Promise.all([
            fs.promises.readdir(heroesDir),
            getHeroesMetadata()
        ])

        heroes = files
            .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file)) // Filter Image Files
            .map((file) => {
                const slug = file.replace(/\.[^/.]+$/, "")
                const grade = getGradeFromFilename(file)
                if (grade === "unknown") return null

                return {
                    filename: file,
                    slug: slug,
                    grade: grade,
                    name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                    is_new_hero: metadata[slug]?.is_new_hero || false
                }
            })
            .filter((h) => h !== null) // Remove unknowns
            .sort((a, b) => {
                // 1. is_new_hero
                if (a.is_new_hero !== b.is_new_hero) return b.is_new_hero ? 1 : -1

                // 2. grade
                const gradeOrder = { "l++": 0, "l+": 1, "l": 2, "r": 3 }
                const ga = gradeOrder[a.grade] ?? 99
                const gb = gradeOrder[b.grade] ?? 99
                if (ga !== gb) return ga - gb

                // 3. filename
                return a.filename.localeCompare(b.filename)
            })

    } catch (error) {
        console.error("Error reading hero files:", error)
    }

    return (
        <div className="container mx-auto">
            <Suspense fallback={
                <div className="flex items-center justify-center py-24 text-[#FFD700]">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            }>
                <BuildView heroes={heroes} />
            </Suspense>
        </div>
    )
}
