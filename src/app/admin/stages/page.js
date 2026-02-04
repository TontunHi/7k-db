import Link from 'next/link'
import { getStages, deleteStage } from '@/lib/stage-actions'
import { Plus, Trash2, Map, Skull, ChevronRight } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminStagesPage() {
    const stages = await getStages('stage')
    const nightmares = await getStages('nightmare')

    return (
        <div className="space-y-12 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Stage Management</h1>
                    <p className="text-muted-foreground mt-2">Manage team recommendations for Stages and Nightmares.</p>
                </div>
                <Link
                    href="/admin/stages/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Create New
                </Link>
            </header>

            {/* Stages Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-primary">
                    <Map className="w-6 h-6" /> Main Stages
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stages.map(stage => (
                        <StageCard key={stage.id} stage={stage} />
                    ))}
                    {stages.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-card/50">
                            No stages created yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Nightmare Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-destructive">
                    <Skull className="w-6 h-6" /> Nightmare Mode
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nightmares.map(stage => (
                        <StageCard key={stage.id} stage={stage} isNightmare />
                    ))}
                    {nightmares.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-card/50">
                            No nightmare stages created yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

function StageCard({ stage, isNightmare }) {
    async function handleDelete() {
        'use server'
        if (confirm('Are you sure you want to delete this stage?')) { // Note: native confirm won't work in server action directly, need client component for interactivity. 
            // For MVP simplicity in server component, we'll wrap in a form button, but "confirm" runs on client.
            // Let's make this a simple form action.
            await deleteStage(stage.id)
        }
    }

    return (
        <div className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer">
            <Link href={`/admin/stages/${stage.id}`} className="absolute inset-0 z-10" />

            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold truncate pr-8">{stage.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                        {new Date(stage.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Delete Button (Z-20 to sit above Link) */}
                <form action={async () => {
                    'use server'
                    await deleteStage(stage.id)
                }} className="z-20 relative">
                    <button className="text-muted-foreground hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {stage.note || "No notes provided."}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    )
}
