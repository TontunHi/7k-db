import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { requireAdmin } from '@/lib/auth-guard'
import {
    ALLOWED_ASSET_TYPES,
    assertAllowedAssetFile,
    assertPathInside,
    sanitizeAssetFilename,
    sanitizeAssetSubfolder,
} from '@/lib/asset-validation'

const PUBLIC_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public')

async function authorizeAssets() {
    try {
        await requireAdmin('MANAGE_ASSETS')
        return null
    } catch (error) {
        const status = error.message?.startsWith('Forbidden') ? 403 : 401
        return NextResponse.json({ error: error.message || 'Unauthorized' }, { status })
    }
}

export async function POST(request) {
    const authError = await authorizeAssets()
    if (authError) return authError

    try {
        const formData = await request.formData()
        const targetType = formData.get('type')
        const file = formData.get('file')

        if (!targetType || !file || !ALLOWED_ASSET_TYPES.includes(targetType)) {
            return NextResponse.json({ error: 'Invalid type or missing file' }, { status: 400 })
        }
        
        const subfolder = sanitizeAssetSubfolder(formData.get('subfolder'))
        const urlSubfolder = subfolder.split(path.sep).join('/')
        let targetDir = path.join(PUBLIC_DIR, targetType)
        
        if (subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        const resolvedPath = assertPathInside(PUBLIC_DIR, targetDir)

        await fs.mkdir(resolvedPath, { recursive: true })

        const filename = sanitizeAssetFilename(file.name)
        assertAllowedAssetFile(file, filename)

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const filePath = path.join(resolvedPath, filename)
        const resolvedFilePath = assertPathInside(resolvedPath, filePath)
        
        await fs.writeFile(resolvedFilePath, buffer, { flag: 'wx' })

        return NextResponse.json({ 
            success: true, 
            filename, 
            path: `/${targetType}${urlSubfolder ? `/${urlSubfolder}` : ''}/${filename}`
        })
    } catch (error) {
        console.error('File upload error:', error)
        if (error.code === 'EEXIST') {
            return NextResponse.json({ error: 'File already exists' }, { status: 409 })
        }
        if (['Illegal path', 'Missing file', 'Unsupported file extension', 'Unsupported file type', 'File is too large'].includes(error.message)) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request) {
    const authError = await authorizeAssets()
    if (authError) return authError

    try {
        const { searchParams } = new URL(request.url)
        const targetType = searchParams.get('type')
        const filename = sanitizeAssetFilename(searchParams.get('filename'))
        const subfolder = sanitizeAssetSubfolder(searchParams.get('subfolder'))

        if (!targetType || !filename || !ALLOWED_ASSET_TYPES.includes(targetType)) {
            return NextResponse.json({ error: 'Invalid type or missing filename' }, { status: 400 })
        }

        let targetDir = path.join(PUBLIC_DIR, targetType)
        if (subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        const filePath = path.join(targetDir, filename)
        const resolvedPath = assertPathInside(PUBLIC_DIR, filePath)
        
        await fs.unlink(resolvedPath)

        return NextResponse.json({ success: true, deleted: filename })
    } catch (error) {
        console.error('File delete error:', error)
        if (error.code === 'ENOENT') {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }
        if (error.message === 'Illegal path') {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
