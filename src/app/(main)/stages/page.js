import { getStages, getStageById } from '@/lib/stage-actions'
import PublicStageView from '@/components/stages/PublicStageView'
import { getHeroImageMap } from '@/lib/hero-utils'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Stage Strategy",
    description: "Optimized team compositions for Main Stage and Nightmare Stage clearing."
}

export default async function StagesPage() {
    const stages = await getStages('stage')
    const nightmares = await getStages('nightmare')

    // We need full details for all stages to render them directly
    const initialStages = await Promise.all(stages.map(s => getStageById(s.id)))
    const initialNightmares = await Promise.all(nightmares.map(s => getStageById(s.id)))
    const heroImageMap = await getHeroImageMap()

    return (
        <PublicStageView 
            initialStages={initialStages} 
            initialNightmares={initialNightmares} 
            heroImageMap={heroImageMap}
        />
    )
}


