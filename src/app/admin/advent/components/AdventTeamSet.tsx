"use client"

import { Trash2, Zap, Video, Plus, ScrollText, ChevronDown, ChevronUp } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../advent.module.css"

/**
 * AdventTeamSet - Modular component for a single Advent Expedition strategy
 */
export default function AdventTeamSet({ 
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
    onOpenBuildPicker 
}) {
    
    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const hasHeroes = set.heroes?.some(h => h !== null)

    return (
        <div className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty)}>
            <div className={styles.setHead}>
                <div className={styles.setMeta}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                            {index + 1}
                        </div>
                        <select
                            value={set.phase || 'Phase 1'}
                            onChange={(e) => onSetUpdate(index, 'phase', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={styles.phaseSelect}
                        >
                            <option value="Phase 1">Phase 1</option>
                            <option value="Phase 2">Phase 2</option>
                        </select>
                        <input
                            type="text"
                            value={set.team_name || ''}
                            onChange={(e) => onSetUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Team Strategy ${index + 1}`}
                            className={styles.setNameInput}
                        />
                    </div>
                    {set._dirty && <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded uppercase">Unsaved</span>}
                    
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

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleCollapse(set.id)}
                        className="text-muted-foreground hover:text-primary p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        title="Remove Team Set"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.setBody}>
                    <TeamBuilder
                        key={`teambuilder-${set.id}-${assets.heroes.length}-${assets.formations.length}`}
                        team={{
                            index: index + 1,
                            formation: set.formation,
                            pet_file: set.pet_file,
                            heroes: set.heroes || [null, null, null, null, null],
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
                                    onOpenBuildPicker(hIdx);
                                }}
                                className={clsx(
                                    "absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all z-30 shadow-xl border backdrop-blur-md",
                                    set.hero_builds?.[hIdx] 
                                        ? "bg-primary/90 hover:bg-primary border-primary/50 text-white opacity-100" 
                                        : "bg-black/60 hover:bg-primary/90 text-white border-white/10 opacity-0 group-hover:opacity-100"
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
                                    <label className={styles.sectionLabel}>
                                        <Zap size={14} className="text-primary" /> Speed
                                    </label>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Adjust order using arrows</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg">
                                    {orderedHeroes.map((item, sortedIdx) => {
                                        const isLast = sortedIdx === orderedHeroes.length - 1;
                                        return (
                                            <div key={item.idx} className="flex items-center gap-2">
                                                <div className="flex flex-col items-center p-0.5 bg-background rounded-xl border border-border relative shadow-lg group/speedhero">
                                                    <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-primary">
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

                                                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center gap-1 opacity-0 group-hover/speedhero:opacity-100 transition-opacity rounded-lg z-30">
                                                        <button 
                                                            onClick={() => handleMove(sortedIdx, -1)}
                                                            disabled={sortedIdx === 0}
                                                            className="w-4 h-4 rounded bg-primary disabled:opacity-20 text-black flex items-center justify-center text-[10px] font-black"
                                                            title="Move Left"
                                                        >
                                                            ◀
                                                        </button>
                                                        <button 
                                                            onClick={() => handleMove(sortedIdx, 1)}
                                                            disabled={isLast}
                                                            className="w-4 h-4 rounded bg-primary disabled:opacity-20 text-black flex items-center justify-center text-[10px] font-black"
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
                        <label className={styles.sectionLabel}>
                            <Zap size={14} className="text-primary" /> Skill Rotation
                        </label>

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
                                            placeholder="..."
                                            className={styles.slotLabelInput}
                                        />
                                        <div className="relative">
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
                                                    <Plus size={16} className="text-muted-foreground opacity-30" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onDeleteSlot(index, slotIdx)}
                                                className={styles.removeSlotBtn}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            <button
                                onClick={() => onAddSlot(index)}
                                disabled={!hasHeroes}
                                className={styles.addSlotBtn}
                                title="Add skill slot"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <Video size={14} /> Video URL
                            </label>
                            <input
                                type="url"
                                value={set.video_url || ''}
                                onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <ScrollText size={14} /> Strategy Note (Notes)
                            </label>
                            <textarea
                                value={set.note || ''}
                                onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                                placeholder="Add specific timings, phase-specific requirements, or critical hero stats..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none h-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
