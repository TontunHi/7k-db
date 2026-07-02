'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, X, Users } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import GuildWarTeamCard from './components/GuildWarTeamCard'
import styles from './GuildWarView.module.css'
import searchStyles from './GuildWarContent.module.css'

/* ─── helpers ─── */
function parseHeroName(filename: string): string {
    return filename
        .replace(/^(a|l\+\+|l\+|l|r|uc|c)_/i, '')
        .replace(/\.[^/.]+$/, '')
        .replace(/_/g, ' ')
}

/* collect every unique hero filename that appears in any team */
function collectAllHeroes(teams: any[]): string[] {
    const seen = new Set<string>()
    for (const team of teams) {
        for (const h of (team.heroes ?? [])) {
            if (h) seen.add(h)
        }
    }
    return Array.from(seen).sort((a, b) =>
        parseHeroName(a).localeCompare(parseHeroName(b))
    )
}

/* ─── component ─── */
export default function GuildWarContent({ teams, heroImageMap }) {
    const [query, setQuery] = useState('')
    const [selectedHeroes, setSelectedHeroes] = useState<string[]>([])

    /* all unique heroes across all teams (stable) */
    const allHeroes = useMemo(() => collectAllHeroes(teams), [teams])

    /* heroes that match the text search */
    const suggestedHeroes = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return []
        return allHeroes.filter(
            h =>
                !selectedHeroes.includes(h) &&
                parseHeroName(h).toLowerCase().includes(q)
        )
    }, [query, allHeroes, selectedHeroes])

    /* toggle a hero chip */
    const toggleHero = useCallback((hero: string) => {
        setSelectedHeroes(prev =>
            prev.includes(hero) ? prev.filter(h => h !== hero) : [...prev, hero]
        )
        setQuery('')
    }, [])

    /* filtered teams — team must include ALL selected heroes */
    const filteredTeams = useMemo(() => {
        if (selectedHeroes.length === 0) return teams
        return teams.filter(team =>
            selectedHeroes.every(h => (team.heroes ?? []).includes(h))
        )
    }, [teams, selectedHeroes])

    const clearAll = () => {
        setSelectedHeroes([])
        setQuery('')
    }

    return (
        <>
            {/* ── Search Bar ── */}
            <div className={searchStyles.searchSection}>
                <div className={searchStyles.searchWrapper}>
                    {/* Input row */}
                    <div className={searchStyles.inputRow}>
                        <Search className={searchStyles.searchIcon} size={16} />

                        {/* selected chips inside the bar */}
                        {selectedHeroes.map(hero => (
                            <button
                                key={hero}
                                onClick={() => toggleHero(hero)}
                                className={searchStyles.chip}
                                title={`Remove ${parseHeroName(hero)}`}
                            >
                                <div className={searchStyles.chipAvatar}>
                                    <SafeImage
                                        src={`/heroes/${hero}`}
                                        alt={parseHeroName(hero)}
                                        fill
                                        className={searchStyles.chipImg}
                                    />
                                </div>
                                <span className={searchStyles.chipName}>{parseHeroName(hero)}</span>
                                <X size={10} className={searchStyles.chipX} />
                            </button>
                        ))}

                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={
                                selectedHeroes.length === 0
                                    ? 'Search by hero name…'
                                    : 'Add another hero…'
                            }
                            className={searchStyles.input}
                        />

                        {(selectedHeroes.length > 0 || query) && (
                            <button onClick={clearAll} className={searchStyles.clearBtn} title="Clear all">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Dropdown suggestions */}
                    {suggestedHeroes.length > 0 && (
                        <div className={searchStyles.dropdown}>
                            {suggestedHeroes.slice(0, 8).map(hero => (
                                <button
                                    key={hero}
                                    onClick={() => toggleHero(hero)}
                                    className={searchStyles.dropdownItem}
                                >
                                    <div className={searchStyles.dropdownAvatar}>
                                        <SafeImage
                                            src={`/heroes/${hero}`}
                                            alt={parseHeroName(hero)}
                                            fill
                                            className={searchStyles.dropdownImg}
                                        />
                                    </div>
                                    <span className={searchStyles.dropdownName}>
                                        {parseHeroName(hero)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Result count */}
                {selectedHeroes.length > 0 && (
                    <div className={searchStyles.resultMeta}>
                        <span className={searchStyles.resultCount}>
                            {filteredTeams.length}
                        </span>
                        <span className={searchStyles.resultLabel}>
                            {filteredTeams.length === 1 ? 'formation found' : 'formations found'}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Teams List ── */}
            <div className={styles.teamsGrid}>
                {filteredTeams.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyGlow} />
                        <div className={styles.emptyIconWrapper}>
                            <Users className={styles.emptyIcon} />
                        </div>
                        <h2 className={styles.emptyTitle}>No formations found</h2>
                        <p className={styles.emptyText}>
                            No team uses all selected heroes together.
                            Try removing a filter or searching for different heroes.
                        </p>
                    </div>
                ) : (
                    filteredTeams.map((team, idx) => (
                        <GuildWarTeamCard
                            key={team.id}
                            team={team}
                            index={idx}
                            heroImageMap={heroImageMap}
                        />
                    ))
                )}
            </div>
        </>
    )
}
