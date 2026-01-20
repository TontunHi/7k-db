import fs from "fs"
import path from "path"
import BuildManager from "@/components/admin/BuildManager"

// Logic to parse filename to grade (Same as BuildPage to ensure consistency)
function getGradeFromFilename(filename) {
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

export const dynamic = 'force-dynamic'

export default async function AdminBuildsPage() {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let heroes = []

    try {
        if (!fs.existsSync(heroesDir)) {
            await fs.promises.mkdir(heroesDir, { recursive: true })
        }

        const files = await fs.promises.readdir(heroesDir)

        heroes = files
            .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
            .map((file) => {
                const grade = getGradeFromFilename(file)
                if (grade === "unknown") return null

                return {
                    filename: file,
                    grade: grade,
                    name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                }
            })
            .filter((h) => h !== null)

            // Sort for admin view (l++ > l+ > l > r)
            .sort((a, b) => {
                const grades = { "l++": 4, "l+": 3, "l": 2, "r": 1 }
                return grades[b.grade] - grades[a.grade]
            })

    } catch (error) {
        console.error("Error reading hero files:", error)
    }

    return <BuildManager heroes={heroes} />
}
