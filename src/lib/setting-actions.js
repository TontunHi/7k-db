'use server'

import pool, { initDB } from "./db"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth-guard"

/**
 * Get a site setting by key
 */
export async function getSetting(key, defaultValue = "") {
    try {
        await initDB()
        const [rows] = await pool.query(
            "SELECT setting_value FROM site_settings WHERE setting_key = ?",
            [key]
        )
        if (rows.length === 0) return defaultValue
        return rows[0].setting_value
    } catch (error) {
        console.error(`Error getting setting ${key}:`, error)
        return defaultValue
    }
}

/**
 * Update a site setting
 */
export async function updateSetting(key, value) {
    try {
        await requireAdmin()
        await initDB()
        
        await pool.query(
            "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
            [key, String(value), String(value)]
        )
        
        revalidatePath("/")
        revalidatePath("/admin")
        revalidatePath("/contact")
        
        return { success: true }
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error)
        return { success: false, error: error.message }
    }
}

/**
 * Convenient helper for contact form status
 */
export async function isContactFormEnabled() {
    const val = await getSetting("contact_form_enabled", "true")
    return val === "true"
}
