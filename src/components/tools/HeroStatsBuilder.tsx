'use client'

import HeroStatsBuilderView from "./hero-stats/HeroStatsBuilderView"

/**
 * HeroStatsBuilder - Modular Wrapper
 * 
 * This file serves as the main entry point for the Hero Stats Builder tool.
 * It has been refactored into modular components located in ./hero-stats/
 * for better maintainability and to adhere to the Cyber-Tech design standards.
 * 
 * Functional logic remains identical to the previous monolithic version.
 */
export default function HeroStatsBuilder({ heroes, items }) {
    return (
        <HeroStatsBuilderView 
            heroes={heroes} 
            items={items} 
        />
    )
}
