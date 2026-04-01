import { NextResponse } from 'next/server'
import pool, { initDB } from '@/lib/db'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
        return NextResponse.json([])
    }

    try {
        await initDB()
        const [rows] = await pool.query(
            "SELECT filename, name, grade FROM heroes WHERE name LIKE ? OR filename LIKE ? LIMIT 10",
            [`%${query}%`, `%${query}%`]
        )

        const results = rows.map(hero => ({
            id: hero.filename.replace(/\.[^/.]+$/, ""),
            name: hero.name || hero.filename.replace(/_/g, " "),
            grade: hero.grade,
            image: `/heroes/${hero.filename}`
        }))

        return NextResponse.json(results)
    } catch (error) {
        console.error("Search API Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
