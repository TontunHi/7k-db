import path from 'path'
import { describe, expect, it } from 'vitest'
import {
    assertAllowedAssetFile,
    assertPathInside,
    sanitizeAssetFilename,
    sanitizeAssetSubfolder,
} from './asset-validation'

describe('asset validation', () => {
    it('sanitizes filenames and subfolders without allowing traversal', () => {
        expect(sanitizeAssetFilename('../Hero Card.webp')).toBe('hero_card.webp')
        expect(sanitizeAssetSubfolder('../l+_ryan\\skills')).toBe(`l+_ryan${path.sep}skills`)
    })

    it('rejects paths outside the intended directory', () => {
        const baseDir = path.resolve('public')
        const targetPath = path.resolve('public', '..', 'package.json')

        expect(() => assertPathInside(baseDir, targetPath)).toThrow('Illegal path')
    })

    it('accepts allowed image uploads and rejects unsafe files', () => {
        const validFile = { type: 'image/webp', size: 1024, arrayBuffer: async () => new ArrayBuffer(0) }
        const svgFile = { type: 'image/svg+xml', size: 1024, arrayBuffer: async () => new ArrayBuffer(0) }

        expect(() => assertAllowedAssetFile(validFile, 'hero.webp')).not.toThrow()
        expect(() => assertAllowedAssetFile(svgFile, 'hero.svg')).toThrow('Unsupported file extension')
    })
})
