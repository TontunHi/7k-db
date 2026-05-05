'use server'

import pool, { initDB } from "./db"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth-guard"
import { type ActionResponse } from "./types"
import { type RowDataPacket } from 'mysql2'

/**
 * Get a site setting by key
 */
export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
    try {
        await initDB()
        const [rows] = await pool.query<({ setting_value: string })[] & RowDataPacket[]>(
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
export async function updateSetting(key: string, value: string | boolean | number): Promise<ActionResponse> {
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
export async function isContactFormEnabled(): Promise<boolean> {
    const val = await getSetting("contact_form_enabled", "true")
    return val === "true"
}
