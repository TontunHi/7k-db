import { getStages, getStageById } from '@/lib/stage-actions'
import PublicStageView from '@/components/stages/PublicStageView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Start Rail - Stage Strategy",
    description: "Optimized team compositions for Main Stage and Nightmare Stage clearing."
}

export default async function StagesPage() {
    const stages = await getStages('stage')
    const nightmares = await getStages('nightmare')

    // We need full details for all stages to render them directly
    const initialStages = await Promise.all(stages.map(s => getStageById(s.id)))
    const initialNightmares = await Promise.all(nightmares.map(s => getStageById(s.id)))

    return (
        <PublicStageView 
            initialStages={initialStages} 
            initialNightmares={initialNightmares} 
        />
    )
}

function PublicStageCard({ stage, isNightmare }) {
    if (!stage) return null;

    return (
        <div className={cn(
            "bg-card border rounded-3xl overflow-hidden shadow-xl transition-all hover:shadow-2xl",
            isNightmare ? "border-destructive/30 shadow-destructive/5" : "border-border"
        )}>
            {/* Header */}
            <div className={cn(
                "p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                isNightmare ? "bg-destructive/10" : "bg-primary/10"
            )}>
                <div>
                    <h3 className={cn(
                        "text-2xl md:text-3xl font-black uppercase tracking-tight",
                        isNightmare ? "text-destructive" : "text-primary"
                    )}>
                        {stage.name}
                    </h3>
                    <p className="text-muted-foreground font-medium mt-1">
                        {new Date(stage.created_at).toLocaleDateString()}
                    </p>
                </div>
                {stage.note && (
                    <div className="bg-background/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 max-w-xl text-sm italic text-muted-foreground">
                        "{stage.note}"
                    </div>
                )}
            </div>

            {/* Teams */}
            <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 divide-y xl:divide-y-0 xl:divide-x divide-border">
                {stage.teams.map((team) => (
                    <div key={team.index} className="space-y-6 pt-8 xl:pt-0 first:pt-0 pl-0 xl:first:pl-0 xl:pl-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-foreground text-background px-3 py-1 rounded-full font-bold text-xs">
                                Team {team.index}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                <Shield className="w-4 h-4" /> Formation: {team.formation.replace("-", " - ")}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Heroes */}
                            <div className="flex-1 grid grid-cols-5 gap-2 md:gap-4">
                                {/* Render 5 slots always */}
                                {[0, 1, 2, 3, 4].map(i => {
                                    const heroFile = team.heroes[i]
                                    const type = getSlotType(team.formation, i)

                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 flex items-center justify-center bg-black/20",
                                                type === 'front'
                                                    ? "border-sky-500/40 shadow-[0_0_15px_-5px_oklch(0.7_0.2_240)]" // Blue glow
                                                    : "border-rose-500/40 shadow-[0_0_15px_-5px_oklch(0.6_0.2_20)]" // Red glow
                                            )}
                                        >
                                            {heroFile ? (
                                                <>
                                                    <Image
                                                        src={`/heroes/${heroFile}`}
                                                        alt="Hero"
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 20vw, 10vw"
                                                    />
                                                    {/* Zone Label */}
                                                    <div className={cn(
                                                        "absolute inset-x-0 bottom-0 py-0.5 text-[8px] md:text-[10px] text-center font-bold uppercase tracking-wider backdrop-blur-sm text-white",
                                                        type === 'front' ? "bg-sky-500/50" : "bg-rose-500/50"
                                                    )}>
                                                        {type}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-muted-foreground/20 text-xs">Empty</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Pet */}
                            <div className="w-full md:w-32 flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-xl bg-muted/5">
                                <span className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Pet
                                </span>
                                <div className="relative w-20 h-20">
                                    {team.pet_file ? (
                                        <Image src={team.pet_file} alt="Pet" fill className="object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                                            -
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Reuse helper for consistency
function getSlotType(formation, index) {
    if (!formation) return 'neutral'
    const [front, back] = formation.split('-').map(Number)
    if (index < front) return 'front'
    return 'back'
}
