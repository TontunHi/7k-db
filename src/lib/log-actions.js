'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'

/**
 * Log a site update event.
 * @param {string} contentType  e.g. 'HERO', 'CASTLE_RUSH', 'GUILD_WAR', 'TOTAL_WAR', 'RAID', 'DUNGEON', 'STAGE'
 * @param {string} targetName   e.g. 'Lu Bu', 'Rudy', 'Legendary Set 1'
 * @param {'CREATE'|'UPDATE'|'DELETE'} actionType
 * @param {string} message      The display message shown on the home page
 */
export async function logSiteUpdate(contentType, targetName, actionType, message) {
    try {
        await initDB()
        await pool.query(
            `INSERT INTO site_updates (content_type, target_name, action_type, message)
             VALUES (?, ?, ?, ?)`,
            [contentType, targetName, actionType, message]
        )
        revalidatePath('/')
    } catch (err) {
        // Never crash a save operation because of a failed log
        console.error('[logSiteUpdate] Failed to write update log:', err.message)
    }
}

/**
 * Get the N most recent site updates for the home page widget.
 */
export async function getRecentUpdates(limit = 10) {
    try {
        await initDB()
        const [rows] = await pool.query(
            `SELECT *, UNIX_TIMESTAMP(created_at) AS unix_ts FROM site_updates ORDER BY created_at DESC LIMIT ?`,
            [limit]
        )
        // Convert unix_ts (seconds) to a proper ISO string in UTC so the client can parse correctly
        return rows.map(r => ({
            ...r,
            created_at: new Date(Number(r.unix_ts) * 1000).toISOString()
        }))
    } catch (err) {
        console.error('[getRecentUpdates] Error:', err.message)
        return []
    }
}
