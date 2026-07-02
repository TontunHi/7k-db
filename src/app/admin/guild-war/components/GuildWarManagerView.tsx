"use client"

import { useState } from "react"
import { Swords, Plus, Save, ChevronsUpDown, ChevronsDownUp, Search, X } from "lucide-react"
import { ActionLabel } from "../../components/AdminEditorial"
import { 
    getGuildWarTeams, 
    createGuildWarTeam, 
    updateGuildWarTeam, 
    deleteGuildWarTeam,
} from "@/lib/guild-war-actions"
import { getSkillImagePath } from "@/lib/formation-utils"
import GuildWarTeamCard from "./GuildWarTeamCard"
import GuildWarSkillPicker from "./GuildWarSkillPicker"
import GuildWarItemPicker from "./GuildWarItemPicker"
import { clsx } from "clsx"
import { toast } from "sonner"
import styles from "../guild-war.module.css"

/**
 * GuildWarManagerView — Orchestrator for Guild War strategic configurations
 * UX improvements:
 *  - Compact header with live stats (total teams / unsaved count)
 *  - Search & Filter by Squad Name or Hero Name
 *  - Collapse All / Expand All
 *  - Duplicate team
 *  - Inline delete confirmation (no window.confirm)
 */
export default function GuildWarManagerView({ initialTeams, initialHeroes, initialPets, initialFormations, initialItems, initialSkills }) {
    const [teams, setTeams]           = useState(initialTeams.map(t => ({ ...t, _dirty: false })))
    const [heroes]                    = useState(initialHeroes)
    const [pets]                      = useState(initialPets)
    const [formations]                = useState(initialFormations)
    const [skillsMap]                 = useState(initialSkills)
    const [gearAssets]                = useState(initialItems)
    const [saving, setSaving]         = useState(false)
    const [searchQuery, setSearchQuery]   = useState('')
    const [allCollapsed, setAllCollapsed] = useState(null) // null = uncontrolled, true/false = forced
    const [skillPicker, setSkillPicker]   = useState(null)
    const [itemPicker, setItemPicker]     = useState(null)
    const [activeTeamIdx, setActiveTeamIdx] = useState(null)
    const [skillErrors, setSkillErrors]   = useState({})

    /* ── Add ── */
    const handleAddTeam = () => {
        const newTeam = {
            id: `new-${Date.now()}`,
            team_index: teams.length + 1,
            type: 'defender',
            team_name: '',
            formation: formations[0]?.value || '1-4',
            pet_file: '',
            pet_supports: [null, null, null],
            heroes: [null, null, null, null, null],
            skill_rotation: [],
            items: [],
            counter_teams: [],
            _isNew: true,
            _dirty: true,
        }
        setTeams(prev => [...prev, newTeam])
        setAllCollapsed(null) // let the new card be independent
        toast.info("New squad initialized")
    }

    /* ── Duplicate ── */
    const handleDuplicateTeam = (idx) => {
        const source = teams[idx]
        const clone = {
            ...JSON.parse(JSON.stringify(source)), // deep clone
            id: `new-${Date.now()}`,
            team_name: `${source.team_name || `Squad ${idx + 1}`} (copy)`,
            _isNew: true,
            _dirty: true,
        }
        setTeams(prev => {
            const next = [...prev]
            next.splice(idx + 1, 0, clone)
            return next
        })
        toast.success("Squad duplicated")
    }

    /* ── Update field ── */
    const handleUpdateTeam = (idx, field, value) => {
        setTeams(prev => {
            const next = [...prev]
            if (field === '_builder') {
                next[idx] = {
                    ...next[idx],
                    formation: value.formation,
                    pet_file: value.pet_file,
                    pet_supports: value.pet_supports,
                    heroes: value.heroes,
                    selection_order: value.selection_order,
                    _dirty: true,
                }
            } else {
                next[idx] = { ...next[idx], [field]: value, _dirty: true }
            }
            return next
        })
    }

    /* ── Delete ── */
    const handleDeleteTeam = async (idx) => {
        const team = teams[idx]
        try {
            if (!team._isNew) await deleteGuildWarTeam(team.id)
            setTeams(prev => prev.filter((_, i) => i !== idx))
            if (activeTeamIdx === idx) setActiveTeamIdx(null)
            toast.success("Squad deleted")
        } catch {
            toast.error("Delete failed")
        }
    }

    /* ── Save all dirty ── */
    const handleSaveAll = async () => {
        setSaving(true)
        const dirtyTeams = teams.filter(t => t._dirty)
        try {
            for (const team of dirtyTeams) {
                const data = {
                    type: team.type || 'defender',
                    team_name: team.team_name,
                    formation: team.formation,
                    pet_file: team.pet_file,
                    pet_supports: team.pet_supports,
                    heroes: team.heroes?.length >= 5 ? team.heroes : [...(team.heroes || []), null, null, null, null, null].slice(0, 5),
                    selection_order: team.selection_order || [],
                    skill_rotation: team.skill_rotation,
                    items: team.items || [],
                    counter_teams: (team.counter_teams || []).map(ct => ({
                        ...ct,
                        heroes: ct.heroes?.length >= 5 ? ct.heroes : [...(ct.heroes || []), null, null, null, null, null].slice(0, 5),
                        items: ct.items || [],
                        skill_rotation: ct.skill_rotation || [],
                    })),
                    note: team.note || '',
                }
                const res = team._isNew
                    ? await createGuildWarTeam(data)
                    : await updateGuildWarTeam(team.id, data)
                if (!res.success) {
                    toast.error(`Failed: ${team.team_name || 'Squad'} — ${res.error}`)
                    setSaving(false)
                    return
                }
            }
            const freshTeams = await getGuildWarTeams('all')
            setTeams(freshTeams.map(t => ({ ...t, _dirty: false })))
            toast.success(`${dirtyTeams.length} squad${dirtyTeams.length > 1 ? 's' : ''} saved`)
        } catch {
            toast.error("Save failed")
        } finally {
            setSaving(false)
        }
    }

    /* ── Skill select ── */
    const handleSkillSelect = (setIdx, slotIdx, skillKey) => {
        if (activeTeamIdx === null || !skillPicker) return
        const { counterIdx } = skillPicker
        setTeams(prev => {
            const next = [...prev]
            const team = next[activeTeamIdx]
            if (counterIdx !== null) {
                const counters = [...(team.counter_teams || [])]
                const rot = [...(counters[counterIdx].skill_rotation || [])]
                rot[slotIdx] = { ...rot[slotIdx], skill: skillKey }
                counters[counterIdx] = { ...counters[counterIdx], skill_rotation: rot }
                next[activeTeamIdx] = { ...team, counter_teams: counters, _dirty: true }
            } else {
                const rot = [...(team.skill_rotation || [])]
                rot[slotIdx] = { ...rot[slotIdx], skill: skillKey }
                next[activeTeamIdx] = { ...team, skill_rotation: rot, _dirty: true }
            }
            return next
        })
        setSkillPicker(null)
    }

    /* ── Item select ── */
    const handleItemSelect = (tid, heroIdx, type, itemFile, accIdx) => {
        if (activeTeamIdx === null || !itemPicker) return
        const { counterIdx } = itemPicker
        setTeams(prev => {
            const next = [...prev]
            const team = next[activeTeamIdx]
            const updateItems = (target) => {
                const items = [...(target.items || [])]
                while (items.length <= heroIdx) items.push({ weapon: '', armor: '', accessories: [null, null, null], note: '' })
                if (type === 'accessories') {
                    const accs = [...(items[heroIdx].accessories || [null, null, null])]
                    accs[accIdx] = itemFile
                    items[heroIdx] = { ...items[heroIdx], accessories: accs }
                } else {
                    items[heroIdx] = { ...items[heroIdx], [type]: itemFile }
                }
                return items
            }
            if (counterIdx !== null) {
                const counters = [...(team.counter_teams || [])]
                counters[counterIdx] = { ...counters[counterIdx], items: updateItems(counters[counterIdx]) }
                next[activeTeamIdx] = { ...team, counter_teams: counters, _dirty: true }
            } else {
                next[activeTeamIdx] = { ...team, items: updateItems(team), _dirty: true }
            }
            return next
        })
        setItemPicker(null)
    }

    const hasDirty    = teams.some(t => t._dirty)
    const dirtyCount  = teams.filter(t => t._dirty).length
    const totalTeams  = teams.length

    return (
        <div className={styles.container}>

            {/* ── Compact Header ── */}
            <header className={styles.headerCard}>
                <div className={styles.headerGlow} />

                {/* Left: icon + title */}
                <div className={styles.headerLeft}>
                    <div className={styles.titleSection}>
                        <div className={styles.iconWrapper}>
                            <Swords size={18} className="text-red-500" />
                        </div>
                        <div className={styles.titleBlock}>
                            <h1 className={styles.title}>GUILD WAR</h1>
                            <p className={styles.subtitle}>Defense · Counter · Loadout</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsBar}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{totalTeams}</span>
                            <span className={styles.statLabel}>Squads</span>
                        </div>
                        {dirtyCount > 0 && (
                            <>
                                <div className={styles.statDivider} />
                                <div className={styles.statItem}>
                                    <span className={clsx(styles.statValue, styles.statValueDanger)}>{dirtyCount}</span>
                                    <span className={styles.statLabel}>Unsaved</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: actions */}
                <div className={styles.headerActions}>
                    <button onClick={handleAddTeam} className={styles.btnSecondary}>
                        <Plus size={14} />
                        ADD SQUAD
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={!hasDirty || saving}
                        className={styles.btnPrimary}
                    >
                        <Save size={14} />
                        {saving ? "SAVING…" : "SAVE ALL"}
                    </button>
                </div>
            </header>

            {/* ── Search Bar ── */}
            {teams.length > 0 && (
                <div className={styles.adminSearchContainer}>
                    <div className={styles.adminSearchWrapper}>
                        <Search size={15} className={styles.adminSearchIcon} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search squads by name or hero name..."
                            className={styles.adminSearchInput}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={styles.adminSearchClear}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── List toolbar ── */}
            {teams.length > 0 && (
                <div className={styles.listToolbar}>
                    <span className={styles.listCount}>
                        {searchQuery.trim() 
                            ? `${teams.filter(t => {
                                const q = searchQuery.toLowerCase().trim()
                                const nameMatch = (t.team_name || '').toLowerCase().includes(q)
                                const heroMatch = (t.heroes || []).some(h => 
                                    h && h.toLowerCase().replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/_/g, ' ').includes(q)
                                )
                                return nameMatch || heroMatch
                              }).length} / ${totalTeams} formation(s)` 
                            : `${totalTeams} formation${totalTeams !== 1 ? 's' : ''}`
                        }
                    </span>
                    <button
                        className={styles.collapseAllBtn}
                        onClick={() => setAllCollapsed(prev => prev === true ? false : true)}
                    >
                        {allCollapsed === true
                            ? <><ChevronsDownUp size={12} /> Expand All</>
                            : <><ChevronsUpDown size={12} /> Collapse All</>
                        }
                    </button>
                </div>
            )}

            {/* ── Team list ── */}
            <div className={styles.teamList}>
                {teams.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className="text-[3rem] font-black opacity-10 italic">NO SQUADS</div>
                        <p className="text-muted-foreground font-bold text-sm">No formations configured yet</p>
                        <button onClick={handleAddTeam} className={styles.btnPrimary}>
                            <Plus size={14} />
                            Add First Squad
                        </button>
                    </div>
                )}

                {teams
                    .map((team, idx) => ({ ...team, _originalIndex: idx })) // Keep track of actual index for callbacks
                    .filter(team => {
                        const q = searchQuery.toLowerCase().trim()
                        if (!q) return true
                        const nameMatch = (team.team_name || '').toLowerCase().includes(q)
                        const heroMatch = (team.heroes || []).some(h => 
                            h && h.toLowerCase().replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/_/g, ' ').includes(q)
                        )
                        return nameMatch || heroMatch
                    })
                    .map((team) => (
                        <GuildWarTeamCard
                            key={team.id}
                            team={team}
                            index={team._originalIndex}
                            heroesList={heroes}
                            petsList={pets}
                            formations={formations}
                            onUpdate={(field, val) => handleUpdateTeam(team._originalIndex, field, val)}
                            onDelete={() => handleDeleteTeam(team._originalIndex)}
                            onDuplicate={() => handleDuplicateTeam(team._originalIndex)}
                            onOpenSkillPicker={(cIdx, sIdx) => {
                                setActiveTeamIdx(team._originalIndex)
                                setSkillPicker({ counterIdx: cIdx, slotIdx: sIdx })
                            }}
                            onOpenItemPicker={(cIdx, hIdx, type, aIdx) => {
                                setActiveTeamIdx(team._originalIndex)
                                setItemPicker({ counterIdx: cIdx, heroIdx: hIdx, type, accIdx: aIdx })
                            }}
                            getSkillImagePath={getSkillImagePath}
                            forceCollapsed={allCollapsed === null ? undefined : allCollapsed}
                        />
                    ))}
            </div>

            {/* ── Sticky save bar ── */}
            {hasDirty && (
                <div className={styles.actionBar}>
                    <div className={styles.saveHint}>
                        <div className={styles.dirtyIndicator} />
                        <span>{dirtyCount} unsaved change{dirtyCount > 1 ? 's' : ''}</span>
                    </div>
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className={styles.btnPrimary}
                    >
                        <Save size={14} />
                        {saving ? 'Saving…' : 'Save All'}
                    </button>
                </div>
            )}

            {/* ── Modals ── */}
            <GuildWarSkillPicker
                setIdx={activeTeamIdx}
                slotIdx={skillPicker?.slotIdx}
                teamHeroes={activeTeamIdx !== null && skillPicker
                    ? (skillPicker.counterIdx !== null && skillPicker.counterIdx !== undefined
                        ? (teams[activeTeamIdx].counter_teams?.[skillPicker.counterIdx]?.heroes || [])
                        : (teams[activeTeamIdx].heroes || []))
                    : []
                }
                skillsMap={skillsMap}
                skillErrors={skillErrors}
                onSelect={handleSkillSelect}
                onClose={() => setSkillPicker(null)}
                onSkillError={(key) => setSkillErrors(prev => ({ ...prev, [key]: true }))}
            />

            <GuildWarItemPicker
                teamId={activeTeamIdx !== null && teams[activeTeamIdx] ? teams[activeTeamIdx].id : null}
                heroIdx={itemPicker?.heroIdx}
                type={itemPicker?.type}
                accIdx={itemPicker?.accIdx}
                items={itemPicker
                    ? (itemPicker.type === 'weapon' ? gearAssets.weapons
                        : itemPicker.type === 'armor' ? gearAssets.armors
                        : gearAssets.accessories)
                    : []
                }
                onSelect={handleItemSelect}
                onClose={() => setItemPicker(null)}
            />
        </div>
    )
}
