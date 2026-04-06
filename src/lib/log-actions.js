'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from './auth-guard'

/** Get update logs for the site */
export async function getRecentUpdates(limit = 10) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM site_updates ORDER BY created_at DESC LIMIT ?',
        [limit]
    )
    return rows
}

/** Log a site update */
export async function logSiteUpdate(contentType, targetName, actionType, message) {
    // This is often called from other server actions which already check requireAdmin
    // But we can check here too if needed, or assume caller handled it.
    await initDB()
    try {
        await pool.query(
            'INSERT INTO site_updates (content_type, target_name, action_type, message) VALUES (?, ?, ?, ?)',
            [contentType, targetName, actionType, message]
        )
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Log Site Update Error:', error)
        return { success: false, error: error.message }
    }
}
