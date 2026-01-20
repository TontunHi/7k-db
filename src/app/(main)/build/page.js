import fs from "fs"
import path from "path"
import BuildView from "@/components/build/BuildView"

export const metadata = {
    title: "Hero Builds | 7K DB",
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
        const files = await fs.promises.readdir(heroesDir)

        heroes = files
            .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file)) // Filter Image Files
            .map((file) => {
                const grade = getGradeFromFilename(file)
                if (grade === "unknown") return null

                return {
                    filename: file,
                    grade: grade,
                    name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                }
            })
            .filter((h) => h !== null) // Remove unknowns

    } catch (error) {
        console.error("Error reading hero files:", error)
        // If folder doesn't exist, we just return empty array
    }

    return (
        <div className="container mx-auto">
            <BuildView heroes={heroes} />
        </div>
    )
}
