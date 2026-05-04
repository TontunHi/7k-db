"use client"

import React from 'react'
import styles from './page.module.css'
import Link from 'next/link'

const FEATURES = [
    { 
        title: "ARENA", 
        description: "Compete with top players", 
        color: "#4facfe", 
        bg: "/images/demo/arena.png",
        id: "01"
    },
    { 
        title: "BOSS RAID", 
        description: "Conquer legendary dragons", 
        color: "#ff4b2b", 
        bg: "/images/demo/raid.png",
        id: "02"
    },
    { 
        title: "HERO BUILDS", 
        description: "Optimal stat combinations", 
        color: "#ffd700", 
        bg: "linear-gradient(45deg, #ffd70022, transparent)",
        id: "03"
    },
    { 
        title: "DUNGEONS", 
        description: "Farm essential resources", 
        color: "#a18cd1", 
        bg: "linear-gradient(45deg, #a18cd122, transparent)",
        id: "04"
    }
]

export default function UIDemoPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.mainTitle}>UI CONCEPT: <span className={styles.highlight}>TEXT-FIRST</span></h1>
                <p className={styles.subtitle}>Removing generic icons to favor game atmosphere and typography.</p>
            </header>

            <div className={styles.grid}>
                {FEATURES.map((feature) => (
                    <div key={feature.title} className={styles.card}>
                        {/* Immersive Background */}
                        <div 
                            className={styles.cardBg} 
                            style={{ 
                                backgroundImage: feature.bg.startsWith('/') ? `url(${feature.bg})` : feature.bg 
                            }} 
                        />
                        <div className={styles.overlay} />
                        
                        {/* Content */}
                        <div className={styles.content}>
                            <div className={styles.idBadge} style={{ color: feature.color }}>{feature.id}</div>
                            <h2 className={styles.title} style={{ '--accent-color': feature.color }}>
                                {feature.title}
                            </h2>
                            <p className={styles.description}>{feature.description}</p>
                            
                            <div className={styles.footer}>
                                <span className={styles.action}>VIEW DATABASE</span>
                                <div className={styles.line} style={{ backgroundColor: feature.color }} />
                            </div>
                        </div>

                        {/* Interactive Border */}
                        <div className={styles.border} style={{ borderColor: `${feature.color}33` }} />
                    </div>
                ))}
            </div>

            <div className={styles.backLink}>
                <Link href="/">← Back to Home</Link>
            </div>
        </div>
    )
}
