'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import HeroQuickPeekModal from './HeroQuickPeekModal'

interface HeroQuickPeekContextType {
    openQuickPeek: (heroIdentifier: string) => void
    closeQuickPeek: () => void
}

const HeroQuickPeekContext = createContext<HeroQuickPeekContextType>({
    openQuickPeek: () => {},
    closeQuickPeek: () => {}
})

export function HeroQuickPeekProvider({ children }: { children: React.ReactNode }) {
    const [activeHero, setActiveHero] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openQuickPeek = useCallback((heroIdentifier: string) => {
        if (!heroIdentifier) return
        setActiveHero(heroIdentifier)
        setIsOpen(true)
    }, [])

    const closeQuickPeek = useCallback(() => {
        setIsOpen(false)
        setActiveHero(null)
    }, [])

    return (
        <HeroQuickPeekContext.Provider value={{ openQuickPeek, closeQuickPeek }}>
            {children}
            {isOpen && activeHero && (
                <HeroQuickPeekModal
                    heroIdentifier={activeHero}
                    onClose={closeQuickPeek}
                />
            )}
        </HeroQuickPeekContext.Provider>
    )
}

export function useHeroQuickPeek() {
    return useContext(HeroQuickPeekContext)
}
