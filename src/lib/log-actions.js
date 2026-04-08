'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { getAdminUser } from './auth-guard'

/** Get update logs for the site */
export async function getRecentUpdates(limit = 10) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT *, UNIX_TIMESTAMP(created_at) as ts FROM site_updates ORDER BY created_at DESC LIMIT ?',
        [limit]
    )
    
    // Use the Unix timestamp (ts) which is always in UTC seconds
    const nowTs = Math.floor(Date.now() / 1000)
    
    return rows.map(row => {
        const diffSecs = nowTs - row.ts
        const diffMins = Math.floor(diffSecs / 60)
        const diffHrs = Math.floor(diffSecs / 3600)
        const diffDays = Math.floor(diffSecs / 86400)

        let timeLabel = ''
        if (diffSecs < 10) timeLabel = 'Just now'
        else if (diffMins < 1) timeLabel = `${diffSecs}s ago`
        else if (diffMins < 60) timeLabel = `${diffMins}m ago`
        else if (diffHrs < 24) timeLabel = `${diffHrs}h ago`
        else if (diffDays < 7) timeLabel = `${diffDays}d ago`
        else timeLabel = new Date(row.ts * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })

        return {
            ...row,
            display_time: timeLabel,
            display_date: new Date(row.ts * 1000).toLocaleDateString('en-US', {
                timeZone: 'Asia/Bangkok',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        }
    })
}

/** Log a site update */
export async function logSiteUpdate(contentType, targetName, actionType, message) {
    // This is often called from other server actions which already check requireAdmin
    // But we fetch the user here to record who did it.
    await initDB()
    const user = await getAdminUser()
    const adminName = user?.username || 'System'

    try {
        await pool.query(
            'INSERT INTO site_updates (content_type, target_name, action_type, message, admin_name) VALUES (?, ?, ?, ?, ?)',
            [contentType, targetName, actionType, message, adminName]
        )
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Log Site Update Error:', error)
        return { success: false, error: error.message }
    }
}
