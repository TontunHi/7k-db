// src/lib/formation-utils.js

export function getSlotType(formation, index) {
    if (!formation) return 'neutral'
    
    if (formation === '1-4') {
        if (index === 2) return 'front'
        return 'back'
    }
    if (formation === '4-1') {
        if (index === 2) return 'back'
        return 'front'
    }
    if (formation === '2-3') {
        if (index === 1 || index === 3) return 'front'
        return 'back'
    }
    if (formation === '3-2') {
        if (index === 1 || index === 3) return 'back'
        return 'front'
    }
    
    const [front] = formation.split('-').map(Number)
    if (index < front) return 'front'
    return 'back'
}

export function getStaggerClass(formation, index) {
    if (!formation) return ''
    
    // In different pages stagger class was translate-y-6 or translate-y-8
    // Defaulting to translate-y-6, components can override if needed
    if (formation === '1-4') {
        if ([0, 1, 3, 4].includes(index)) return 'translate-y-6'
    }
    if (formation === '2-3') {
        if ([0, 2, 4].includes(index)) return 'translate-y-6'
    }
    if (formation === '3-2') {
        if ([1, 3].includes(index)) return 'translate-y-6'
    }
    if (formation === '4-1') {
        if (index === 2) return 'translate-y-6'
    }
    return ''
}

export function getSkillImagePath(heroIdentifier, skillNumber) {
    if (!heroIdentifier) return null
    // Remove any extension to get the folder name (slug)
    const folderName = heroIdentifier.replace(/\.[^/.]+$/, "")
    // Try .webp first — Next.js Image will 404 gracefully if file doesn't exist
    return `/skills/${folderName}/${skillNumber}.webp`
}
