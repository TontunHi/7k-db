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

/**
 * Logic to parse filename to grade.
 * @param {string} filename 
 */
export function getGradeFromFilename(filename) {
    if (!filename) return "unknown"
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

/**
 * Parses hero filename into a clean object.
 * @param {string} filename 
 */
export function parseHeroDetails(filename) {
    if (!filename) return null
    const slug = filename.replace(/\.[^/.]+$/, "")
    const grade = getGradeFromFilename(filename)
    const name = filename
        .replace(/^(l\+\+|l\+|l|r)_/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")

    return { filename, slug, grade, name }
}
