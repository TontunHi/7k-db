'use client'

import TierlistCreatorView from "./tierlist/TierlistCreatorView"

/**
 * TierlistCreator - Modular Wrapper
 * 
 * This file serves as the main entry point for the Tier List Maker tool.
 * It has been refactored into modular components located in ./tierlist/
 * for better maintainability and to adhere to the Cyber-Tech design standards.
 * 
 * All functional features (drag-drop, export, save) are preserved.
 */
export default function TierlistCreator() {
    return (
        <TierlistCreatorView />
    )
}
