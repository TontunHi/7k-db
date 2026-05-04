"use client"

import * as React from "react"

const ThemeContext = React.createContext({ theme: "dark", setTheme: () => {} })

export function ThemeProvider({ children, defaultTheme = "dark", attribute = "class", storageKey = "theme" }) {
    const [theme, setThemeState] = React.useState(defaultTheme)

    // On mount, read persisted theme from localStorage
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) setThemeState(stored)
        } catch {}
    }, [storageKey])

    // Apply theme to the document element
    React.useEffect(() => {
        const root = document.documentElement
        if (attribute === "class") {
            root.classList.remove("light", "dark")
            root.classList.add(theme)
        } else {
            root.setAttribute(attribute, theme)
        }
        try {
            localStorage.setItem(storageKey, theme)
        } catch {}
    }, [theme, attribute, storageKey])

    const setTheme = React.useCallback((newTheme) => {
        setThemeState(newTheme)
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = React.useContext(ThemeContext)
    return { ...ctx, resolvedTheme: ctx.theme }
}
