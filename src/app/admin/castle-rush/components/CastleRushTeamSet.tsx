"use client"

import { ActionLabel, Marker, SystemBadge } from "../../components/AdminEditorial"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../castle-rush.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/**
 * CastleRushTeamSet - Modular component for a single team setup
 */
export default function CastleRushTeamSet({ 
    set, 
    index, 
    assets, 
    skillErrors,
    isCollapsed,
    onTeamUpdate, 
    onSetUpdate, 
    onDelete, 
    onAddSlot, 
    onDeleteSlot, 
    onUpdateSlotLabel,
    onOpenSkillPicker,
    onToggleCollapse,
    onSkillError,
    onDuplicate,
    onOpenBuildPicker
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: set.id })

    const sortableStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: 'relative',
        opacity: isDragging ? 0.5 : 1
    }

    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const hasHeroes = set.heroes?.some(h => h !== null)

    return (
        <div 
            ref={setNodeRef} 
            style={sortableStyle}
            className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty, isDragging && "shadow-2xl")}
        >
            <div className={styles.setHead}>
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                        <button 
                            {...attributes} 
                            {...listeners} 
                            className="px-2 py-1 hover:bg-accent rounded cursor-grab active:cursor-grabbing text-muted-foreground transition-colors text-[10px] font-black"
                        >
                            DRAG
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm italic">
                                0{index + 1}
                            </div>
                        <input
                            type="text"
                            value={set.team_name || ''}
                            onChange={(e) => onSetUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Team ${index + 1}`}
                            className={styles.setNameInput}
                        />
                    </div>
                </div>
                    {set._dirty && <SystemBadge variant="warning">UNSAVED</SystemBadge>}
                    
                    {isCollapsed && (
                        <div className="flex items-center gap-1.5 ml-4 animate-in fade-in slide-in-from-left-2">
                            {set.heroes.map((hero, hIdx) => hero && (
                                <div key={hIdx} className="relative w-7 h-7 rounded-md overflow-hidden border border-border">
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onDuplicate(index)}
                        className="text-muted-foreground hover:text-amber-500 px-2 py-1 transition-colors"
                    >
                        <ActionLabel label="DUPLICATE" size="text-[9px]" />
                    </button>
                    <button
                        onClick={() => onToggleCollapse(set.id)}
                        className="text-muted-foreground hover:text-amber-500 px-2 py-1 transition-colors"
                    >
                        <ActionLabel label={isCollapsed ? "EXPAND" : "CLOSE"} size="text-[9px]" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors px-2 py-1"
                    >
                        <ActionLabel label="REMOVE" size="text-[9px]" />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.setBody}>
                    <TeamBuilder
                        team={{
                            index: index + 1,
                            formation: set.formation,
                            pet_file: set.pet_file,
                            aura: set.aura,
                            heroes: set.heroes,
                            selection_order: set.selection_order || []
                        }}
                        index={index}
                        heroesList={assets.heroes}
                        petsList={assets.pets}
                        formations={assets.formations}
                        onUpdate={(teamData) => onTeamUpdate(index, teamData)}
                        renderHeroAction={(hIdx, heroFile) => heroFile ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenBuildPicker({ setIdx: index, heroIdx: hIdx });
                                }}
                                className={clsx(
                                    "absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all z-30 shadow-xl border backdrop-blur-md",
                                    set.hero_builds?.[hIdx] 
                                        ? "bg-amber-600/90 hover:bg-amber-500 text-black border-amber-400/50 opacity-100" 
                                        : "bg-black/60 hover:bg-amber-600/90 text-white border-white/10 opacity-0 group-hover:opacity-100"
                                )}
                            >
                                {set.hero_builds?.[hIdx] ? 'Edit Build' : 'Set Build'}
                            </button>
                        ) : null}
                    />

                    {/* Speed Order Section */}
                    {set.heroes && set.heroes.some(h => h) && (() => {
                        const validHeroes = set.heroes
                            .map((heroFile, idx) => ({ heroFile, idx }))
                            .filter(item => item.heroFile);

                        // Order heroes based on selection_order
                        const selOrder = set.selection_order || [];
                        const orderedHeroes = [...validHeroes].sort((a, b) => {
                            const indexA = selOrder.indexOf(a.idx);
                            const indexB = selOrder.indexOf(b.idx);
                            if (indexA === -1 && indexB === -1) return a.idx - b.idx;
                            if (indexA === -1) return 1;
                            if (indexB === -1) return -1;
                            return indexA - indexB;
                        });

                        const handleMove = (itemIdx, direction) => {
                            const currentOrder = orderedHeroes.map(h => h.idx);
                            const targetIdx = itemIdx + direction;
                            if (targetIdx < 0 || targetIdx >= currentOrder.length) return;

                            const newOrder = [...currentOrder];
                            const temp = newOrder[itemIdx];
                            newOrder[itemIdx] = newOrder[targetIdx];
                            newOrder[targetIdx] = temp;

                            onSetUpdate(index, 'selection_order', newOrder);
                        };

                        return (
                            <div className={styles.rotationSection}>
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Marker color="bg-amber-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Speed</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Adjust order using arrows</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg">
                                    {orderedHeroes.map((item, sortedIdx) => {
                                        const isLast = sortedIdx === orderedHeroes.length - 1;
                                        return (
                                            <div key={item.idx} className="flex items-center gap-2">
                                                <div className="flex flex-col items-center p-0.5 bg-background rounded-xl border border-border relative shadow-lg group/speedhero">
                                                    <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-amber-500">
                                                        {sortedIdx + 1}
                                                    </div>
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                                        <SafeImage 
                                                            src={`/heroes/${item.heroFile}`} 
                                                            alt="" 
                                                            fill 
                                                            sizes="40px" 
                                                            className="object-contain" 
                                                        />
                                                    </div>

                                                    {/* Control overlays */}
                                                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center gap-1 opacity-0 group-hover/speedhero:opacity-100 transition-opacity rounded-lg z-30">
                                                        <button 
                                                            onClick={() => handleMove(sortedIdx, -1)}
                                                            disabled={sortedIdx === 0}
                                                            className="w-4 h-4 rounded bg-amber-500 disabled:opacity-20 text-black flex items-center justify-center text-[10px] font-black"
                                                            title="Move Left"
                                                        >
                                                            ◀
                                                        </button>
                                                        <button 
                                                            onClick={() => handleMove(sortedIdx, 1)}
                                                            disabled={isLast}
                                                            className="w-4 h-4 rounded bg-amber-500 disabled:opacity-20 text-black flex items-center justify-center text-[10px] font-black"
                                                            title="Move Right"
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                </div>
                                                {!isLast && (
                                                    <div className="flex items-center justify-center w-5 opacity-40">
                                                        <span className="text-muted-foreground text-xs font-black">➔</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Skill Rotation */}
                    <div className={styles.rotationSection}>
                        <div className="mb-4">
                            <Marker color="bg-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest ml-2 text-muted-foreground">Skill Rotation</span>
                        </div>

                        <div className={styles.rotationGrid}>
                            {(set.skill_rotation || []).map((slot, slotIdx) => {
                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                const heroFile = set.heroes?.[hIdx]
                                const skillPath = slot.skill ? getSkillImagePath(heroFile, sNum) : null
                                const errKey = `slot-${set.id}-${slotIdx}`
                                const hasError = skillErrors[errKey]

                                return (
                                    <div key={slotIdx} className={styles.slot}>
                                        <input
                                            type="text"
                                            value={slot.label || ''}
                                            onChange={(e) => onUpdateSlotLabel(index, slotIdx, e.target.value)}
                                            placeholder={`Step ${slotIdx + 1}`}
                                            className={styles.slotLabelInput}
                                        />
                                        <div className="relative">
                                            <div className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 bg-amber-500 text-black rounded-full flex items-center justify-center text-[8px] font-black z-20 pointer-events-none shadow">
                                                {slotIdx + 1}
                                            </div>
                                            <button
                                                onClick={() => onOpenSkillPicker({ setIdx: index, slotIdx })}
                                                disabled={!hasHeroes}
                                                className={clsx(
                                                    styles.skillBtn,
                                                    slot.skill && styles.skillBtnActive
                                                )}
                                            >
                                                {slot.skill && heroFile && skillPath && !hasError ? (
                                                    <SafeImage
                                                        src={skillPath}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        onError={() => onSkillError(errKey)}
                                                    />
                                                ) : (
                                                    <span className="text-[10px] font-black opacity-10">ADD</span>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDeleteSlot(index, slotIdx)}
                                                className={styles.removeSlotBtn}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            <button
                                onClick={() => onAddSlot(index)}
                                disabled={!hasHeroes}
                                className={styles.addSlotBtn}
                                title="Add rotation slot"
                            >
                                <span className="text-[10px] font-black">+ Add Skill</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Briefing (URL)</span>
                            </div>
                            <input
                                type="url"
                                value={set.video_url || ''}
                                onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Marker color="bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Intel (Notes)</span>
                            </div>
                            <textarea
                                value={set.note || ''}
                                onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                                placeholder="Add specific timings or boss-specific requirements..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none h-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
