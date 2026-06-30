"use client"

import { Trash2, Zap, Video, Plus, ScrollText, ChevronDown, ChevronUp, Copy } from "lucide-react"
import TeamBuilder from "@/components/admin/TeamBuilder"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../raid.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/**
 * RaidTeamSet - Modular component for a single raid squad setup
 */
export default function RaidTeamSet({ 
    set, 
    index, 
    assets, 
    skillErrors,
    isCollapsed,
    onTeamUpdate, 
    onSetUpdate, 
    onDelete, 
    onDuplicate,
    onToggleSkill,
    onToggleCollapse,
    onSkillError,
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

    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: 'relative' as const,
        opacity: isDragging ? 0.5 : 1
    }
    
    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    const rotation = set.skill_rotation || []

    return (
        <div 
            ref={setNodeRef}
            style={sortableStyle}
            className={clsx(styles.teamSet, set._dirty && styles.teamSetDirty, isDragging && "shadow-2xl")}
        >
            {/* Header */}
            <div className={styles.setHead}>
                <div className="flex items-center gap-4 flex-1">
                    <button 
                        {...attributes} 
                        {...listeners} 
                        className="px-2 py-1 hover:bg-accent rounded cursor-grab active:cursor-grabbing text-muted-foreground transition-colors text-[10px] font-black"
                    >
                        DRAG
                    </button>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleCollapse(set.id)}>
                        <div className={styles.setIndex}>{index + 1}</div>
                        <input
                            type="text"
                            value={set.team_name || ''}
                            onChange={(e) => onSetUpdate(index, 'team_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={`Team ${index + 1}`}
                            className={styles.setNameInput}
                        />
                    </div>
                    {set._dirty && <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-black rounded uppercase">Unsaved</span>}
                    
                    {/* Inline Summary when collapsed */}
                    {isCollapsed && (
                        <div className="flex items-center gap-1.5 ml-4 animate-in fade-in slide-in-from-left-2">
                            {(set.heroes || []).map((hero, hIdx) => hero && (
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
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-accent rounded-lg transition-colors"
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                        {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>
                    <button
                        onClick={() => onDuplicate(index)}
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Duplicate Team"
                    >
                        <Copy size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="text-muted-foreground hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Team"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className={styles.setBody}>
                    {/* Team Builder Core */}
                    <TeamBuilder
                        key={`teambuilder-${set.id}-${assets.heroes.length}-${assets.formations.length}`}
                        team={{
                            index: index + 1,
                            formation: set.formation || (assets.formations[0]?.value ?? '2-3'),
                            pet_file: set.pet_file,
                            aura: set.aura,
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
                                        ? "bg-red-600/90 hover:bg-red-500 border-red-500/50 text-white opacity-100" 
                                        : "bg-black/60 hover:bg-red-600/90 text-white border-white/10 opacity-0 group-hover:opacity-100"
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
                                        <Zap size={14} className="text-red-500" /> Speed Order
                                    </label>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Adjust skill order using arrows</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg">
                                    {orderedHeroes.map((item, sortedIdx) => {
                                        const isLast = sortedIdx === orderedHeroes.length - 1;
                                        return (
                                            <div key={item.idx} className="flex items-center gap-2">
                                                <div className="flex flex-col items-center p-0.5 bg-background rounded-xl border border-border relative shadow-lg group/speedhero">
                                                    <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-red-500 text-white">
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
                                                            className="w-4 h-4 rounded bg-red-500 disabled:opacity-20 text-white flex items-center justify-center text-[10px] font-black"
                                                            title="Move Left"
                                                        >
                                                            ◀
                                                        </button>
                                                        <button 
                                                            onClick={() => handleMove(sortedIdx, 1)}
                                                            disabled={isLast}
                                                            className="w-4 h-4 rounded bg-red-500 disabled:opacity-20 text-white flex items-center justify-center text-[10px] font-black"
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

                    {/* Grid-based Skill Rotation */}
                    <div className={styles.rotationSection}>
                        <div className="flex justify-between items-end border-b border-border pb-2">
                            <label className={styles.sectionLabel}>
                                <Zap size={14} className="text-red-500" /> Skill Rotation Grid
                            </label>
                            <span className="text-[9px] font-black uppercase text-muted-foreground opacity-50 italic">Click icons to set rotation order</span>
                        </div>

                        <div className={styles.skillPool}>
                            {[0, 1, 2, 3, 4].map(heroIdx => {
                                const heroFile = set.heroes?.[heroIdx]
                                if (!heroFile) return <div key={heroIdx} className={styles.heroColumn} />
                                
                                const heroSlug = heroFile.replace(/\.[^/.]+$/, "")
                                const skills = assets.skills?.[heroSlug] || ["4", "3", "2", "1"]

                                return (
                                    <div key={heroIdx} className={styles.heroColumn}>
                                        {skills.map(skillName => {
                                            const skillDataKey = `${heroIdx}-${skillName}`
                                            const skillPath = getSkillImagePath(heroFile, skillName)
                                            const orderIndex = rotation.indexOf(skillDataKey)
                                            const order = orderIndex >= 0 ? orderIndex + 1 : null
                                            const errKey = `set-${set.id}-h${heroIdx}-s${skillName}`

                                            return (
                                                <button
                                                    key={skillName}
                                                    onClick={() => onToggleSkill(index, skillDataKey)}
                                                    className={clsx(
                                                        styles.skillToggle,
                                                        order && styles.skillToggleActive
                                                    )}
                                                >
                                                    <div className={styles.skillIconWrapper}>
                                                        {skillPath && !skillErrors[errKey] && (
                                                            <SafeImage
                                                                src={skillPath}
                                                                alt=""
                                                                fill
                                                                className={clsx("object-contain p-1", !order && "grayscale opacity-60")}
                                                                onError={() => onSkillError(errKey)}
                                                            />
                                                        )}
                                                    </div>
                                                    {order && <div className={styles.orderBadge}>{order}</div>}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <Video size={14} /> Guide Video (URL)
                            </label>
                            <input
                                type="url"
                                value={set.video_url || ''}
                                onChange={(e) => onSetUpdate(index, 'video_url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className={styles.sectionLabel}>
                                <ScrollText size={14} /> Additional Notes
                            </label>
                            <textarea
                                value={set.note || ''}
                                onChange={(e) => onSetUpdate(index, 'note', e.target.value)}
                                placeholder="Document phase transitions and timing requirements..."
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none h-full min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
