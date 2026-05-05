import fs from "fs"
import path from "path"
import { getHeroSlug } from "./hero-utils"

/**
 * Scans the heroes directory and returns a map of slug -> fullFilename.
 * This allows resolving an extension-agnostic slug back to its physical file.
 * This is a SERVER-ONLY function because it uses 'fs'.
 */
export async function getHeroImageMap() {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    if (!fs.existsSync(heroesDir)) return {}

    try {
        const files = await fs.promises.readdir(heroesDir)
        const imageMap = {}
        
        files.forEach(file => {
            if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
                const slug = getHeroSlug(file)
                // If multiple extensions exist for same slug, this will pick the last one found
                imageMap[slug] = file
            }
        })
        
        return imageMap
    } catch (error) {
        console.error("Error creating hero image map:", error)
        return {}
    }
}
