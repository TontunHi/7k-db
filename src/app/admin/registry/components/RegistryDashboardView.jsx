"use client"

import { useState } from "react"
import HeroRegistry from "./hero/HeroRegistry"
import PetRegistry from "./pet/PetRegistry"
import ItemRegistry from "./item/ItemRegistry"
import styles from "./RegistryDashboard.module.css"
import { clsx } from "clsx"
import { Marker } from "@/app/admin/components/AdminEditorial"

/**
 * RegistryDashboardView - Orchestrator for Database Registry
 */
export default function RegistryDashboardView({ initialData }) {
    const [activeTab, setActiveTab] = useState("heroes")

    const tabs = [
        { id: "heroes", name: "HERO_REGISTRY", color: "bg-blue-500" },
        { id: "pets", name: "PET_DATABASE", color: "bg-amber-500" },
        { id: "items", name: "ARMORY_LOGS", color: "bg-emerald-500" }
    ]

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <div className="flex items-center gap-4 mb-2">
                        <Marker color="bg-primary" className="w-2 h-10" />
                        <h1 className={styles.title}>DATABASE REGISTRY</h1>
                    </div>
                    <p className={styles.subtitle}>
                        Centralized metadata management for Heroes, Pets, and Items
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
                            <Marker color={isActive ? "bg-white" : tab.color} />
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
