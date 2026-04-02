import fs from "fs"
import path from "path"

/**
 * Strips the extension from a filename to create a hero slug.
 * @param {string} filename 
 */
export function getHeroSlug(filename) {
    if (!filename) return ""
    return filename.replace(/\.[^/.]+$/, "")
}

/**
 * Scans the heroes directory and returns a map of slug -> fullFilename.
 * This allows resolving an extension-agnostic slug back to its physical file.
 * Cache this in a production environment if needed.
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

/**
 * Returns the correct image filename for a given hero slug from the provided map.
 * @param {string} slug 
 * @param {Record<string, string>} imageMap 
 */
export function resolveHeroImage(slug, imageMap) {
    if (!slug) return null
    // If slug already has extension, it might be an old record or direct filename
    if (/\.(png|jpg|jpeg|webp)$/i.test(slug)) {
        return slug 
    }
    return imageMap[slug] || null
}
