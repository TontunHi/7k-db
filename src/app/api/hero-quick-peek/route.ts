import { NextResponse } from 'next/server'
import { getHeroBuildList } from '@/lib/hero-actions'
import { getHeroData, getHeroBuilds } from '@/lib/build-db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const heroParam = searchParams.get('hero')

        if (!heroParam) {
            return NextResponse.json({ error: 'Hero identifier is required' }, { status: 400 })
        }

        const cleanSlug = heroParam.replace(/\.[^/.]+$/, "")
        const allHeroes = await getHeroBuildList()

        // Match by slug or filename or partial name
        let matched = allHeroes.find(h => 
            h.slug === cleanSlug || 
            h.filename.startsWith(cleanSlug) || 
            h.name.toLowerCase() === cleanSlug.toLowerCase()
        )

        // Fallback: strip grade prefix like l+_ or r_
        if (!matched) {
            const rawName = cleanSlug.replace(/^(a|al\+\+|al\+|al|ar|l\+\+|l\+|l|r|uc|c)_/, "")
            matched = allHeroes.find(h => 
                h.name.toLowerCase() === rawName.toLowerCase() || 
                h.slug.endsWith(rawName)
            )
        }

        if (!matched) {
            return NextResponse.json({
                slug: cleanSlug,
                filename: heroParam.endsWith('.webp') || heroParam.endsWith('.png') ? heroParam : `${heroParam}.webp`,
                name: cleanSlug.replace(/^(a|al\+\+|al\+|al|ar|l\+\+|l\+|l|r|uc|c)_/, "").replace(/_/g, " "),
                grade: "l+",
                type: null,
                skillPriority: [],
                builds: []
            })
        }

        const [heroDetails, heroBuilds] = await Promise.all([
            getHeroData(matched.slug),
            getHeroBuilds(matched.slug)
        ])

        return NextResponse.json({
            slug: matched.slug,
            filename: matched.filename,
            name: heroDetails?.name || matched.name,
            grade: heroDetails?.grade || matched.grade,
            type: matched.type,
            skillPriority: heroDetails?.skillPriority || [],
            builds: (heroBuilds || []).map((b: any, idx: number) => ({
                id: b.id,
                buildIndex: idx + 1,
                title: b.mode && b.mode.length > 0 ? b.mode.join(' / ') : `Build #${idx + 1}`,
                mode: b.mode,
                cLevel: b.cLevel,
                author_name: b.author_name || null,
                author_contact: b.author_contact || null,
                weapons: b.weapons,
                armors: b.armors,
                accessories: b.accessories,
                substats: b.substats
            }))
        })
    } catch (error: any) {
        console.error('Error in /api/hero-quick-peek:', error)
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 })
    }
}
