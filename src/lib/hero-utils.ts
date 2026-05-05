/**
 * Strips the extension from a filename to create a hero slug.
 */
export function getHeroSlug(filename: string | null | undefined): string {
    if (!filename) return ""
    return filename.replace(/\.[^/.]+$/, "")
}

/**
 * Returns the correct image filename for a given hero slug from the provided map.
 */
export function resolveHeroImage(slug: string | null | undefined, imageMap: Record<string, string>): string | null {
    if (!slug) return null
    // If slug already has extension, it might be an old record or direct filename
    if (/\.(png|jpg|jpeg|webp)$/i.test(slug)) {
        return slug 
    }
    return imageMap[slug] || null
}

/**
 * Logic to parse filename to grade.
 */
export function getGradeFromFilename(filename: string | null | undefined): string {
    if (!filename) return "unknown"
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

export interface HeroDetails {
    filename: string;
    slug: string;
    grade: string;
    name: string;
}

/**
 * Parses hero filename into a clean object.
 */
export function parseHeroDetails(filename: string | null | undefined): HeroDetails | null {
    if (!filename) return null
    const slug = filename.replace(/\.[^/.]+$/, "")
    const grade = getGradeFromFilename(filename)
    const name = filename
        .replace(/^(l\+\+|l\+|l|r)_/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")

    return { filename, slug, grade, name }
}
