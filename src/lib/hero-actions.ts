import fs from "fs"
import path from "path"
import { getHeroesMetadata } from "./build-db"

export interface HeroListItem {
    filename: string;
    slug: string;
    grade: string;
    name: string;
    is_new_hero: boolean;
    type: string | null;
}

/**
 * Logic to parse filename to grade
 * Filenames: l++_Name.png, l+_Name.png, l_Name.png, r_Name.png
 */
function getGradeFromFilename(filename: string): string {
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

/**
 * Fetches and processes the list of heroes for the Build page.
 */
export async function getHeroBuildList(): Promise<HeroListItem[]> {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let heroes: HeroListItem[] = []

    try {
        const [files, metadata] = await Promise.all([
            fs.promises.readdir(heroesDir),
            getHeroesMetadata()
        ])

        heroes = files
            .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
            .map((file): HeroListItem | null => {
                const slug = file.replace(/\.[^/.]+$/, "")
                const grade = getGradeFromFilename(file)
                if (grade === "unknown") return null

                return {
                    filename: file,
                    slug: slug,
                    grade: grade,
                    name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                    is_new_hero: metadata[slug]?.is_new_hero || false,
                    type: metadata[slug]?.type || null
                }
            })
            .filter((h): h is HeroListItem => h !== null)
            .sort((a, b) => {
                // 1. is_new_hero
                if (a.is_new_hero !== b.is_new_hero) return b.is_new_hero ? 1 : -1

                // 2. grade
                const gradeOrder: Record<string, number> = { "l++": 0, "l+": 1, "l": 2, "r": 3 }
                const ga = gradeOrder[a.grade] ?? 99
                const gb = gradeOrder[b.grade] ?? 99
                if (ga !== gb) return ga - gb

                // 3. filename
                return a.filename.localeCompare(b.filename)
            })

    } catch (error) {
        console.error("Error reading hero files:", error)
        return []
    }

    return heroes
}
