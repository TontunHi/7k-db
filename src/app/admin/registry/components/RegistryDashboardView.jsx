"use client"

import { useState } from "react"
import { Shield, Sparkles, Sword, Database } from "lucide-react"
import HeroRegistry from "./hero/HeroRegistry"
import PetRegistry from "./pet/PetRegistry"
import ItemRegistry from "./item/ItemRegistry"
import styles from "./RegistryDashboard.module.css"
import { clsx } from "clsx"

/**
 * RegistryDashboardView - Orchestrator for Database Registry
 * 
 * Manages the top-level navigation between Hero, Pet, and Item registries.
 * Uses CSS Modules for styling to ensure no leakage and better maintenance.
 */
export default function RegistryDashboardView({ initialData }) {
    const [activeTab, setActiveTab] = useState("heroes")

    const tabs = [
        { id: "heroes", name: "Heroes", icon: Shield, color: "text-blue-500" },
        { id: "pets", name: "Pets", icon: Sparkles, color: "text-amber-500" },
        { id: "items", name: "Items", icon: Sword, color: "text-emerald-500" }
    ]

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>
                        <div className={styles.iconBox}>
                            <Database className={styles.icon} />
                        </div>
                        Database Registry
                    </h1>
                    <p className={styles.subtitle}>
                        Centralized Metadata management for Heroes, Pets, and Items
                    </p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                styles.tabButton,
                                isActive && styles.activeTab
                            )}
                        >
                            <tab.icon className={clsx(styles.tabIcon, !isActive && tab.color)} />
                            {tab.name}
                        </button>
                    )
                })}
            </nav>

            {/* Content Display Section */}
            <section className={styles.contentSection}>
                {activeTab === "heroes" && (
                    <HeroRegistry initialData={initialData.heroes} />
                )}
                {activeTab === "pets" && (
                    <PetRegistry 
                        initialData={initialData.pets} 
                        assets={initialData.assets?.pets} 
                    />
                )}
                {activeTab === "items" && (
                    <ItemRegistry 
                        initialData={initialData.items} 
                        assets={initialData.assets?.items} 
                    />
                )}
            </section>
        </div>
    )
}
