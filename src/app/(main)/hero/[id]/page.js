import Image from 'next/image'
import Link from 'next/link'
import { getHeroProfile } from '@/lib/stage-actions'
import { ChevronRight, ExternalLink, Shield, Sword, Sparkles, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function HeroProfilePage({ params }) {
    const { id } = await params
    const hero = await getHeroProfile(id)

    if (!hero) {
        return <div className="text-center py-20 text-gray-500">Hero not found.</div>
    }

    const gradeColors = {
        'l++': 'from-amber-400 to-yellow-600 border-amber-500 shadow-amber-500/20',
        'l+': 'from-amber-300 to-yellow-500 border-amber-400 shadow-amber-400/20',
        'l': 'from-amber-200 to-yellow-400 border-amber-300 shadow-amber-300/20',
        'r': 'from-rose-400 to-rose-600 border-rose-500 shadow-rose-500/20',
        'uc': 'from-emerald-400 to-emerald-600 border-emerald-500 shadow-emerald-500/20',
        'c': 'from-gray-400 to-gray-600 border-gray-500 shadow-gray-500/20'
    }

    const currentGradeColor = gradeColors[hero.grade?.toLowerCase()] || 'from-gray-700 to-gray-900 border-gray-600'

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Splash Header */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
                <Image 
                    src={`/heroes/${hero.filename}`} 
                    alt={hero.name} 
                    fill 
                    className="object-cover object-top opacity-40 blur-sm scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col md:flex-row items-end md:items-center gap-8 p-8 md:p-12">
                    <div className="relative h-64 w-48 md:h-80 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                         <Image src={`/heroes/${hero.filename}`} alt={hero.name} fill className="object-cover" priority />
                    </div>
                    
                    <div className="space-y-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border bg-gradient-to-r font-black text-black uppercase tracking-widest text-xs shadow-lg", currentGradeColor)}>
                            {hero.grade} Grade
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                            {hero.name}
                        </h1>
                        <p className="text-gray-400 max-w-xl font-medium leading-relaxed">
                            Optimal builds and content recommendations for {hero.name}.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Skills & Info */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-black flex items-center gap-2 text-[#FFD700]">
                            <Sparkles className="w-5 h-5" /> Hero Skills
                        </h2>
                        <div className="grid grid-cols-4 gap-3 bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                            {hero.skills.length > 0 ? hero.skills.map((skill, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700 bg-black hover:border-[#FFD700] transition-colors group">
                                    <Image src={skill} alt="skill" fill className="p-1 object-contain group-hover:scale-110 transition-transform" />
                                </div>
                            )) : (
                                <div className="col-span-4 text-center py-4 text-gray-600 text-sm italic">No skill assets uploaded yet.</div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-black flex items-center gap-2 text-sky-400">
                            <ExternalLink className="w-5 h-5" /> Used In These Teams
                        </h2>
                        <div className="space-y-3">
                            {hero.usedIn.length > 0 ? hero.usedIn.map((item, idx) => (
                                <Link 
                                    key={idx} 
                                    href={item.link}
                                    className="flex items-center justify-between p-4 bg-gray-900/80 hover:bg-gray-800 border border-gray-800 rounded-xl transition-all group hover:border-sky-500/50"
                                >
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.type}</div>
                                        <div className="text-white font-bold">{item.name}</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                                </Link>
                            )) : (
                                <div className="text-gray-600 text-sm italic p-4 bg-gray-900/30 rounded-xl border border-dashed border-gray-800 text-center">
                                    Not currently recommended in any specific team guide.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Builds */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <h2 className="text-xl font-black flex items-center gap-2 text-rose-500">
                            <Sword className="w-5 h-5" /> Recommended Builds
                        </h2>
                        
                        {hero.builds.length > 0 ? hero.builds.map((build, idx) => (
                            <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Shield className="w-32 h-32 rotate-12" />
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg font-black text-sm uppercase">C.Level {build.c_level}</div>
                                        <div className="flex gap-1">
                                            {build.modes.map((m, i) => (
                                                <span key={i} className="text-[10px] text-gray-400 font-bold px-2 py-0.5 rounded border border-gray-800 bg-black/50">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {build.note && <p className="text-xs text-gray-500 italic max-w-xs">{build.note}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    {/* Equipment */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Equipment Set</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {build.weapons.map((w, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-black/60 rounded-lg border border-gray-800 text-sm font-bold text-gray-300 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500" /> {w}
                                                </div>
                                            ))}
                                            {build.armors.map((a, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-black/60 rounded-lg border border-gray-800 text-sm font-bold text-gray-300 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500" /> {a}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {build.accessories.map((acc, i) => (
                                                <div key={i} className="px-3 py-1.5 bg-[#FFD700]/5 rounded-lg border border-[#FFD700]/20 text-sm font-bold text-[#FFD700] flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#FFD700]" /> {acc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Substats */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Recommended Substats</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {build.substats.map((s, i) => (
                                                <div key={i} className="p-2 bg-black/40 rounded-xl border border-gray-800 text-xs font-medium text-gray-400">
                                                    {s}
                                                </div>
                                            ))}
                                            {build.substats.length === 0 && <div className="text-gray-700 text-xs italic">No specific substats mentioned.</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl p-12 text-center text-gray-600 font-medium">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No build guides have been added for this hero yet.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
