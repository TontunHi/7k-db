import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request) {
    try {
        const formData = await request.formData()
        const targetType = formData.get('type') // 'heroes', 'pets', or 'skills'
        const file = formData.get('file')

        if (!targetType || !file) {
            return NextResponse.json({ error: 'Missing type or file' }, { status: 400 })
        }
        
        // Additional subfolder for skills
        const subfolder = formData.get('subfolder') || '' 

        let targetDir = path.join(process.cwd(), 'public', targetType)
        if (targetType === 'skills' && subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        // Ensure directory exists
        await fs.mkdir(targetDir, { recursive: true })

        // Read file
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        let filename = file.name
        // Clean name somewhat just to be safe
        filename = filename.replace(/[^a-zA-Z0-9.\-_+]/g, '').toLowerCase()

        const filePath = path.join(targetDir, filename)
        await fs.writeFile(filePath, buffer)

        return NextResponse.json({ success: true, filename, path: `/${targetType}${subfolder ? `/${subfolder}` : ''}/${filename}` })
    } catch (error) {
        console.error('File upload error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const targetType = searchParams.get('type') // 'heroes', 'pets', 'skills'
        const filename = searchParams.get('filename')
        const subfolder = searchParams.get('subfolder') || ''

        if (!targetType || !filename) {
            return NextResponse.json({ error: 'Missing type or filename' }, { status: 400 })
        }

        let targetDir = path.join(process.cwd(), 'public', targetType)
        if (targetType === 'skills' && subfolder) {
            targetDir = path.join(targetDir, subfolder)
        }

        const filePath = path.join(targetDir, filename)
        
        // Delete file
        await fs.unlink(filePath)

        return NextResponse.json({ success: true, deleted: filename })
    } catch (error) {
        console.error('File delete error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
