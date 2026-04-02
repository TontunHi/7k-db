/**
 * Strips the extension from a filename to create a hero slug.
 * @param {string} filename 
 */
export function getHeroSlug(filename) {
    if (!filename) return ""
    return filename.replace(/\.[^/.]+$/, "")
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
