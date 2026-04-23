'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Video, ExternalLink, Users, Link as LinkIcon, Compass } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'

function ExpandableNote({ note }) {
    const [expanded, setExpanded] = useState(false)
    if (!note || note.trim() === "") return null;

    return (
        <div className="mt-8 p-5 bg-card border border-border rounded-xl shadow-inner relative overflow-hidden transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500/50"></div>
            
            <div className={cn("flex items-center justify-between pl-2", expanded ? "mb-4" : "")}>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Strategy Note</span>
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-violet-400 hover:text-violet-300 font-bold px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 rounded-md transition-colors"
                >
                    {expanded ? 'Hide Note' : 'Read Note'}
                </button>
            </div>
            
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    <div className="pl-2 pt-4 border-t border-border mt-2">
                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {note}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TeamDisplay({ heroes, formation, petFile, skillRotation, teamColor, heroImageMap }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    teamColor === 'sky' ? "text-sky-400" : "text-violet-400"
                )}>
                    Team Composition
                </span>
                <span className="text-xs text-muted-foreground">Formation: {formation?.replace('-', ' - ')}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Heroes Grid */}
                <FormationGrid 
                    formation={formation} 
                    heroes={heroes} 
                    heroImageMap={heroImageMap}
                    customClasses={{
                        container: "grid grid-cols-5 gap-2 pb-2 max-w-[300px] md:max-w-[340px]",
                        emptyRender: ({isFront}) => (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">Empty</div>
                        ),
                        cardString: cn(
                            "bg-muted border border-border aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 shadow-inner"
                        )
                    }}
                />

                {/* Pet */}
                <PetDisplay 
                    petFile={petFile} 
                    hideLabel={true}
                    customClasses={{
                        wrapper: "w-20 h-20 border-none bg-transparent shadow-none"
                    }}
                />
            </div>

            {/* Skill Rotation Slots */}
            <SkillSequence 
                skillRotation={skillRotation} 
                heroes={heroes} 
            />
        </div>
    )
}

export default function BossClient({ sets, heroImageMap }) {
    const [phase, setPhase] = useState('Phase 1')
    const filteredSets = sets.filter(s => (s.phase || 'Phase 1') === phase)

    return (
        <div className="container mx-auto px-4 mt-8 relative z-10 space-y-8">
            {/* Phase Selector */}
            <div className="flex justify-center mb-8">
                <div className="bg-muted border border-border rounded-xl p-1 flex">
                    {['Phase 1', 'Phase 2'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPhase(p)}
                            className={cn(
                                "px-8 py-3 rounded-lg font-bold transition-all",
                                phase === p 
                                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {sets.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No team recommendations available yet.</p>
                </div>
            ) : filteredSets.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
                    <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No teams registered for {phase}.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredSets.map((set, idx) => (
                        <div 
                            key={set.id} 
                            className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Decorative Line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>

                            {/* Set Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-border bg-muted/30 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-extrabold text-lg shadow-inner">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-2xl font-black text-foreground tracking-wide">
                                        {set.team_name || `Set ${idx + 1}`}
                                    </h3>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600/90 hover:bg-red-500 text-white rounded-lg font-bold transition-colors shadow"
                                        >
                                            <Video className="w-4 h-4" />
                                            Video
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <TeamDisplay
                                    heroes={set.heroes}
                                    formation={set.formation}
                                    petFile={set.pet_file}
                                    skillRotation={set.skill_rotation}
                                    teamColor="violet"
                                    heroImageMap={heroImageMap}
                                />

                                {/* Note */}
                                <ExpandableNote note={set.note} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
