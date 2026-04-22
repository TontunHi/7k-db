'use client'

import BuildSimulatorView from "./simulator/BuildSimulatorView"

/**
 * BuildSimulator - Modular Wrapper
 * 
 * This file serves as the main entry point for the Build Simulator tool.
 * It has been refactored into modular components located in ./simulator/
 * for better maintainability and to adhere to the Cyber-Tech design standards.
 * 
 * Functional logic remains identical to the previous monolithic version.
 */
export default function BuildSimulator({ initialHero, onBack }) {
    return (
        <BuildSimulatorView 
            initialHero={initialHero} 
            onBack={onBack} 
        />
    )
}
