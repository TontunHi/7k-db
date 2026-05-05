import path from 'path'

export const ALLOWED_ASSET_TYPES = [
    'heroes',
    'pets',
    'skills',
    'about_website',
    'advent_expedition',
    'castle_rush',
    'dungeon',
    'formation',
    'items',
    'logo_tiers',
    'raid',
    'total_war',
]

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
    'image/webp',
    'image/png',
    'image/jpeg',
])

export const ALLOWED_IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg'])
export const MAX_ASSET_FILE_SIZE_BYTES = 5 * 1024 * 1024

export function sanitizeAssetSegment(value) {
    if (!value) return ''
    return String(value)
        .replace(/\0/g, '')
        .replace(/[\\/]+/g, '')
        .replace(/[<>:"|?*]/g, '')
        .replace(/[^a-zA-Z0-9._+-]/g, '_')
        .replace(/\.{2,}/g, '.')
        .replace(/^[.\\/\s]+|[.\\/\s]+$/g, '')
}

export function sanitizeAssetSubfolder(value) {
    return String(value || '')
        .split(/[\\/]+/)
        .map(sanitizeAssetSegment)
        .filter(Boolean)
        .join(path.sep)
}

export function sanitizeAssetFilename(value) {
    const filename = sanitizeAssetSegment(value).toLowerCase()
    if (!filename) return ''
    return path.basename(filename)
}

export function assertAllowedAssetFile(file, filename) {
    if (!file || typeof file.arrayBuffer !== 'function') {
        throw new Error('Missing file')
    }

    const extension = path.extname(filename)
    if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
        throw new Error('Unsupported file extension')
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
        throw new Error('Unsupported file type')
    }

    if (typeof file.size === 'number' && file.size > MAX_ASSET_FILE_SIZE_BYTES) {
        throw new Error('File is too large')
    }
}

export function assertPathInside(baseDir, targetPath) {
    const resolvedBase = path.resolve(baseDir)
    const resolvedTarget = path.resolve(targetPath)
    const relative = path.relative(resolvedBase, resolvedTarget)

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error('Illegal path')
    }

    return resolvedTarget
}
