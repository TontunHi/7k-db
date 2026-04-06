import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/session'

const ALLOWED_TYPES = ['heroes', 'pets', 'skills', 'about_website', 'advent_expedition', 'castle_rush', 'dungeon', 'formation', 'items', 'logo_tiers', 'raid', 'total_war']

async function isAuthenticated() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    return await validateSession(token)
}

function sanitizePath(str) {
    if (!str) return ''
    // Remove null bytes, control characters, and directory traversal sequences
    return str.replace(/\0/g, '').replace(/\.\.\//g, '').replace(/\.\.\\/g, '').replace(/[<>:"|?*]/g, '')
}

export async function POST(request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const targetType = formData.get('type')
        const file = formData.get('file')

        if (!targetType || !file || !ALLOWED_TYPES.includes(targetType)) {
            return NextResponse.json({ error: 'Invalid type or missing file' }, { status: 400 })
        }
        
        const subfolder = sanitizePath(formData.get('subfolder'))
        const publicDir = path.join(process.cwd(), 'public')
        let targetDir = path.join(publicDir, targetType)
        
        if (subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        // Final Path check to prevent traversal
        const resolvedPath = path.resolve(targetDir)
        if (!resolvedPath.startsWith(path.resolve(publicDir))) {
             return NextResponse.json({ error: 'Illegal path' }, { status: 400 })
        }

        await fs.mkdir(resolvedPath, { recursive: true })

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        const filename = sanitizePath(file.name).toLowerCase()
        const filePath = path.join(resolvedPath, filename)
        
        await fs.writeFile(filePath, buffer)

        return NextResponse.json({ 
            success: true, 
            filename, 
            path: `/${targetType}${subfolder ? `/${subfolder}` : ''}/${filename}` 
        })
    } catch (error) {
        console.error('File upload error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const targetType = searchParams.get('type')
        const filename = sanitizePath(searchParams.get('filename'))
        const subfolder = sanitizePath(searchParams.get('subfolder'))

        if (!targetType || !filename || !ALLOWED_TYPES.includes(targetType)) {
            return NextResponse.json({ error: 'Invalid type or missing filename' }, { status: 400 })
        }

        const publicDir = path.join(process.cwd(), 'public')
        let targetDir = path.join(publicDir, targetType)
        if (subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        const filePath = path.join(targetDir, filename)
        const resolvedPath = path.resolve(filePath)
        
        // Ensure path is within public and is actually a file
        if (!resolvedPath.startsWith(path.resolve(publicDir))) {
            return NextResponse.json({ error: 'Illegal path' }, { status: 400 })
        }
        
        await fs.unlink(resolvedPath)

        return NextResponse.json({ success: true, deleted: filename })
    } catch (error) {
        console.error('File delete error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
