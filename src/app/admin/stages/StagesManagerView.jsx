"use client"

import Link from "next/link"
import { Marker, ActionLabel } from "../components/AdminEditorial"
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
                <div className="flex items-center gap-4">
                    <Marker color="bg-emerald-500" className="w-2 h-10" />
                    <div>
                        <h1 className={styles.title}>STAGE LOGISTICS</h1>
                        <p className={styles.subtitle}>Manage team configurations and battle strategies for PVE content.</p>
                    </div>
                </div>
                <Link href="/admin/stages/new" className={styles.createBtn}>
                    <ActionLabel label="CREATE SETUP" />
                </Link>
            </header>

            {/* Stages Section */}
            <section className={styles.section}>
                <div className="flex items-center gap-3 mb-6">
                    <Marker color="bg-emerald-500" />
                    <h2 className="text-sm font-black uppercase tracking-widest opacity-80">Main Stages</h2>
                </div>
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
                <div className="flex items-center gap-3 mb-6">
                    <Marker color="bg-red-600" />
                    <h2 className="text-sm font-black uppercase tracking-widest opacity-80">Nightmare Mode</h2>
                </div>
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
