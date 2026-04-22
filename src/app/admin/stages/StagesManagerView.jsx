"use client"

import Link from "next/link"
import { Plus, Map, Skull } from "lucide-react"
import StageCard from "./components/StageCard"
import styles from "./stages.module.css"

/**
 * StagesManagerView - Main dashboard for Stages and Nightmare management
 */
export default function StagesManagerView({ stages = [], nightmares = [] }) {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Stage Logistics</h1>
                    <p className={styles.subtitle}>Manage team configurations and battle strategies for PVE content.</p>
                </div>
                <Link href="/admin/stages/new" className={styles.createBtn}>
                    <Plus size={20} />
                    <span>Create Setup</span>
                </Link>
            </header>

            {/* Stages Section */}
            <section className={styles.section}>
                <h2 className={`${styles.sectionTitle} ${styles.titleNormal}`}>
                    <Map size={24} /> Main Stages
                </h2>
                <div className={styles.grid}>
                    {stages.map(stage => (
                        <StageCard key={stage.id} stage={stage} />
                    ))}
                    {stages.length === 0 && (
                        <div className={styles.emptyState}>
                            No main stage guides have been created yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Nightmare Section */}
            <section className={styles.section}>
                <h2 className={`${styles.sectionTitle} ${styles.titleNightmare}`}>
                    <Skull size={24} /> Nightmare Mode
                </h2>
                <div className={styles.grid}>
                    {nightmares.map(stage => (
                        <StageCard key={stage.id} stage={stage} isNightmare />
                    ))}
                    {nightmares.length === 0 && (
                        <div className={styles.emptyState}>
                            No nightmare guides recorded in the database.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
