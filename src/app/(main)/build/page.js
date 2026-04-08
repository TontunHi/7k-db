import fs from "fs"
import path from "path"
import BuildView from "@/components/build/BuildView"
import ContributorPopup from "@/components/builds/ContributorPopup"
import { getHeroesMetadata } from "@/lib/build-db"

export const metadata = {
    title: "Hero Builds",
    description: "Recommended builds for Legendary and Rare heroes.",
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

export const dynamic = 'force-dynamic' // Ensure list updates if files change (in regular node env usually need rebuild, but good practice here)

export default async function BuildPage() {
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
        // If folder doesn't exist, we just return empty array
    }

    return (
        <div className="container mx-auto relative">
            <BuildView heroes={heroes} />
            <ContributorPopup />
        </div>
    )
}
