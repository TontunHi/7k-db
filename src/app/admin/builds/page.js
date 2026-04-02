import fs from "fs"
import path from "path"
import BuildManager from "@/components/admin/BuildManager"
import { getHeroesMetadata } from "@/lib/build-db"

// Logic to parse filename to grade (Same as BuildPage to ensure consistency)
function getGradeFromFilename(filename) {
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Hero Builds' }

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
            .filter((h) => h !== null)

            // Sort logic: is_new_hero > grade > filename
            .sort((a, b) => {
                // 1. is_new_hero
                if (a.is_new_hero !== b.is_new_hero) return b.is_new_hero ? 1 : -1

                // 2. grade
                const gradesOrder = { "l++": 4, "l+": 3, "l": 2, "r": 1 }
                const rankA = gradesOrder[a.grade] || 0
                const rankB = gradesOrder[b.grade] || 0
                if (rankA !== rankB) return rankB - rankA

                // 3. filename
                return a.filename.localeCompare(b.filename)
            })

    } catch (error) {
        console.error("Error reading hero files:", error)
    }

    return <BuildManager heroes={heroes} />
}
