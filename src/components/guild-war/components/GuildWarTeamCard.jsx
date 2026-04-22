'use client'
import { useState } from 'react'
import { 
    ChevronDown, Layout, Briefcase, Zap, ShieldAlert
} from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import GuildWarTabContent from './GuildWarTabContent'
import { clsx } from 'clsx'
import styles from './GuildWarTeamCard.module.css'

export default function GuildWarTeamCard({ team, heroImageMap, index }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Layout, color: '#818cf8', bg: 'rgba(99, 102, 241, 0.1)' },
        { id: 'equipment', label: 'Equipment', icon: Briefcase, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)' },
        { id: 'skills', label: 'Rotation', icon: Zap, color: '#c084fc', bg: 'rgba(168, 85, 247, 0.1)' },
        { id: 'counters', label: 'Counters', icon: ShieldAlert, color: '#fb7185', bg: 'rgba(244, 63, 94, 0.1)', count: team.counter_teams?.length || 0 },
    ]

    return (
        <div className={clsx(
            styles.card,
            isExpanded && styles.cardExpanded
        )}>
            <div className={clsx(
                styles.container,
                isExpanded && styles.containerExpanded
            )}>
                {/* Background Glow */}
                <div className={clsx(
                    styles.backgroundGlow,
                    isExpanded && styles.backgroundGlowExpanded
                )} />

                {/* Header Area */}
                <div 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={styles.header}
                >
                    {!isExpanded ? (
                        <div className={styles.collapsedBanner}>
                            <div className={styles.topAccent} />
                            <div className={styles.bannerLayout}>
                                <div className={styles.portraits}>
                                    {(team.heroes || []).filter(h => h).map((hero, i, arr) => (
                                        <div 
                                            key={i} 
                                            className={styles.portraitWrapper} 
                                            style={{ maxWidth: `${100 / Math.max(arr.length, 3)}%` }}
                                        >
                                            <div className={styles.portrait}>
                                                <SafeImage src={`/heroes/${hero}`} alt="" fill className={styles.portraitImage} />
                                                {i === arr.length - 1 && <div className={styles.portraitFade} />}
                                                <div className={styles.portraitShadow} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.teamBrief}>
                                    <div className={styles.badgeGroup}>
                                        {team.type && team.type !== 'general' && (
                                            <span className={clsx(
                                                styles.typeBadge,
                                                team.type === 'attacker' ? styles.attacker : styles.defender
                                            )}>
                                                {team.type}
                                            </span>
                                        )}
                                        {team.formation && (
                                            <span className={styles.formationBadge}>
                                                {team.formation}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={styles.teamName}>
                                        {team.team_name || 'Unnamed Formation'}
                                    </h3>
                                    <div className={styles.badgeGroup}>
                                        {team.pet_file && (
                                            <div className={styles.petMini}>
                                                <SafeImage src={team.pet_file.startsWith('/') ? team.pet_file : `/pets/${team.pet_file}`} alt="" fill className={styles.miniPetImage} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.expandAction}>
                                    <div className={styles.expandButton}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.expandedHeader}>
                            <div className={styles.teamTitleGroup}>
                                <div className={styles.badgeGroup}>
                                    {team.type && team.type !== 'general' && (
                                        <span className={clsx(
                                            styles.typeBadge,
                                            team.type === 'attacker' ? styles.attacker : styles.defender
                                        )}>
                                            {team.type}
                                        </span>
                                    )}
                                    {team.formation && (
                                        <span className={styles.formationBadge}>
                                            {team.formation}
                                        </span>
                                    )}
                                </div>
                                <h3 className={styles.expandedTeamName}>
                                    {team.team_name || 'Unnamed Formation'}
                                </h3>
                            </div>

                            <div className={styles.actionGroup}>
                                <div className={styles.tabBar}>
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveTab(tab.id)
                                            }}
                                            className={clsx(
                                                styles.tabButton,
                                                activeTab === tab.id && styles.tabActive
                                            )}
                                        >
                                            <tab.icon size={14} />
                                            {tab.label}
                                            {tab.count !== undefined && tab.count > 0 && (
                                                <span className="ml-1 opacity-50">({tab.count})</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                
                                <button className={styles.collapseButton}>
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className={styles.contentArea}>
                        {/* Mobile Tabs */}
                        <div className={styles.mobileTabs}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        styles.mobileTab,
                                        activeTab === tab.id && styles.mobileTabActive
                                    )}
                                >
                                    <tab.icon 
                                        className={styles.mobileTabIcon} 
                                        style={{ color: activeTab === tab.id ? tab.color : 'inherit' }} 
                                    />
                                    <span className={styles.mobileTabText}>
                                        {tab.label}
                                    </span>
                                    {activeTab === tab.id && (
                                        <div 
                                            className={styles.tabIndicator} 
                                            style={{ backgroundColor: tab.color }} 
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className={styles.body}>
                            <GuildWarTabContent 
                                activeTab={activeTab} 
                                team={team} 
                                heroImageMap={heroImageMap} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
