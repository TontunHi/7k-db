import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TIER_CONFIG } from '@/lib/total-war-config'
import { getSetsByTier } from '@/lib/total-war-actions'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import { ArrowLeft, Users, Swords, Layers } from 'lucide-react'
import { getHeroImageMap } from '@/lib/hero-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { tier: tierKey } = await params
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)
    if (!tierCfg) return { title: 'Tier Not Found' }
    return {
        title: `Total War — ${tierCfg.label}`,
        description: `Team sets for Total War ${tierCfg.label} tier.`,
    }
}

export default async function TotalWarTierPage({ params }) {
    const { tier: tierKey } = await params
    const tierCfg = TIER_CONFIG.find(t => t.key === tierKey)

    if (!tierCfg) notFound()

    const sets = await getSetsByTier(tierKey)
    const heroImageMap = await getHeroImageMap()

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div
                    className="absolute left-0 right-0 top-0 -z-10 m-auto h-[350px] w-[350px] rounded-full opacity-15 blur-[110px]"
                    style={{ backgroundColor: tierCfg.accent }}
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back button */}
                <Link
                    href="/total-war"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg border border-gray-700/50"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Total War</span>
                </Link>

                {/* Tier Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    {/* Logo */}
                    <div className="relative w-36 h-36 shrink-0 drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]">
                        <Image
                            src={tierCfg.logo}
                            alt={tierCfg.label}
                            fill
                            className="object-contain"
                            priority
                            sizes="144px"
                        />
                    </div>

                    {/* Title */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                            <Swords className="w-5 h-5" style={{ color: tierCfg.accent }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: tierCfg.accent }}>
                                Total War
                            </span>
                        </div>
                        <h1
                            className="text-5xl md:text-6xl font-black uppercase italic tracking-tight -skew-x-3 inline-block drop-shadow-2xl"
                            style={{ color: tierCfg.accent }}
                        >
                            {tierCfg.label}
                        </h1>
                        <div
                            className="h-1 w-32 mt-3 rounded transform -skew-x-12"
                            style={{ background: `linear-gradient(to right, ${tierCfg.accent}, transparent)`, boxShadow: `0 0 12px ${tierCfg.accent}60` }}
                        />
                        <p className="text-gray-500 text-sm mt-3 font-mono">
                            {tierCfg.maxTeams} Teams per Set &bull; {sets.length} Set{sets.length !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    {/* Tier mini nav */}
                    <div className="flex items-center gap-2">
                        {TIER_CONFIG.map(t => (
                            <Link
                                key={t.key}
                                href={`/total-war/${t.key}`}
                                title={t.label}
                                className={`relative w-11 h-11 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                                    t.key === tierKey
                                        ? `${t.border} scale-110`
                                        : 'border-gray-800 opacity-40 hover:opacity-70 hover:scale-105'
                                }`}
                            >
                                <Image src={t.logo} alt={t.label} fill className="object-contain p-1" sizes="44px" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sets */}
                {sets.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                        <Layers className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No team sets available yet.</p>
                        <p className="text-gray-700 text-sm mt-1">Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {sets.map((set, setIdx) => (
                            <div key={set.id} className="space-y-1">
                                {/* Set Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm text-black shrink-0"
                                        style={{ backgroundColor: tierCfg.accent }}
                                    >
                                        {setIdx + 1}
                                    </div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-wide">
                                        {set.set_name || `Set ${setIdx + 1}`}
                                    </h2>
                                    <div
                                        className="flex-1 h-px"
                                        style={{ background: `linear-gradient(to right, ${tierCfg.accent}40, transparent)` }}
                                    />
                                    <span className="text-xs text-gray-600 font-mono shrink-0">
                                        {set.teams?.length || 0} / {tierCfg.maxTeams} teams
                                    </span>
                                </div>

                                {/* Teams in this Set */}
                                {(!set.teams || set.teams.length === 0) ? (
                                    <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl text-gray-700 text-sm">
                                        No teams in this set yet.
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {set.teams.map((team, teamIdx) => (
                                            <div
                                                key={team.id}
                                                className="bg-gradient-to-b from-gray-900/70 to-black border border-gray-800 rounded-2xl overflow-hidden"
                                            >
                                                {/* Team Header */}
                                                <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-800/60 bg-gray-900/40">
                                                    <div
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-black shrink-0"
                                                        style={{ backgroundColor: tierCfg.accent + 'cc' }}
                                                    >
                                                        {teamIdx + 1}
                                                    </div>
                                                    <h3 className="text-base font-bold text-white">
                                                        {team.team_name || `Team ${teamIdx + 1}`}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        {team.formation?.replace('-', ' - ')}
                                                    </span>
                                                    {team.video_url && (
                                                        <a
                                                            href={team.video_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs transition-colors"
                                                        >
                                                            Watch Video
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="p-5">
                                                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                                                        {/* Formation Grid */}
                                                        <div className="w-full max-w-[380px] md:max-w-[480px]">
                                                            <FormationGrid
                                                                formation={team.formation}
                                                                heroes={team.heroes}
                                                                heroImageMap={heroImageMap}
                                                                customClasses={{
                                                                    container: "grid grid-cols-5 gap-2 md:gap-3 pb-6 max-w-full",
                                                                    emptyRender: () => (
                                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs">Empty</div>
                                                                    ),
                                                                    cardString: "bg-black border-2 aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300"
                                                                }}
                                                            />
                                                        </div>
                                                        {/* Pet */}
                                                        <PetDisplay
                                                            petFile={team.pet_file}
                                                            hideLabel={true}
                                                            customClasses={{ wrapper: "w-20 h-20 border-none bg-transparent shadow-none" }}
                                                        />
                                                    </div>

                                                    {/* Skill Rotation */}
                                                    <SkillSequence
                                                        skillRotation={team.skill_rotation}
                                                        heroes={team.heroes}
                                                        heroImageMap={heroImageMap}
                                                        customClasses={{ container: "mt-4 space-y-3" }}
                                                    />

                                                    {/* Note */}
                                                    {team.note && (
                                                        <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-xl">
                                                            <p className="text-gray-400 text-sm italic">{team.note}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Set note */}
                                {set.note && (
                                    <div className="mt-3 px-4 py-2.5 bg-gray-900/40 border border-gray-800/60 rounded-xl">
                                        <p className="text-gray-500 text-sm italic">{set.note}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
