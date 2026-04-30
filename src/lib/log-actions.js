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

/** Get paginated updates with optional filtering */
export async function getPaginatedUpdates({ type = 'all', page = 1, limit = 50 } = {}) {
    await initDB()
    const offset = (page - 1) * limit
    
    let query = 'SELECT *, UNIX_TIMESTAMP(created_at) as ts FROM site_updates'
    const params = []

    if (type !== 'all') {
        query += ' WHERE content_type = ?'
        params.push(type)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.query(query, params)
    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM site_updates ${type !== 'all' ? 'WHERE content_type = ?' : ''}`,
        type !== 'all' ? [type] : []
    )

    const nowTs = Math.floor(Date.now() / 1000)
    
    return {
        logs: rows.map(row => ({
            ...row,
            display_time: new Date(row.ts * 1000).toLocaleString('en-US', {
                timeZone: 'Asia/Bangkok',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        })),
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
    }
}

/** Get the single most recent update time for a content type */
export async function getLastUpdate(contentType) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT UNIX_TIMESTAMP(max(created_at)) as ts FROM site_updates WHERE content_type = ?',
        [contentType]
    )
    
    const ts = rows[0]?.ts
    if (!ts) return null

    const nowTs = Math.floor(Date.now() / 1000)
    const diffSecs = nowTs - ts
    const diffMins = Math.floor(diffSecs / 60)
    const diffHrs = Math.floor(diffSecs / 3600)
    const diffDays = Math.floor(diffSecs / 86400)

    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    
    return new Date(ts * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}

/** Log a site update with consolidation logic to prevent clutter */
export async function logSiteUpdate(contentType, targetName, actionType, message) {
    await initDB()
    const user = await getAdminUser()
    const adminName = user?.username || 'System'

    try {
        // Consolidation logic: Check if a similar log exists within the last 15 minutes
        const [existing] = await pool.query(
            `SELECT id FROM site_updates 
             WHERE content_type = ? AND target_name = ? AND action_type = ? 
             AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
             ORDER BY created_at DESC LIMIT 1`,
            [contentType, targetName, actionType]
        )

        if (existing.length > 0) {
            // Update existing log
            await pool.query(
                'UPDATE site_updates SET message = ?, created_at = NOW(), admin_name = ? WHERE id = ?',
                [message, adminName, existing[0].id]
            )
        } else {
            // Create new log
            await pool.query(
                'INSERT INTO site_updates (content_type, target_name, action_type, message, admin_name) VALUES (?, ?, ?, ?, ?)',
                [contentType, targetName, actionType, message, adminName]
            )
        }

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Log Site Update Error:', error)
        return { success: false, error: error.message }
    }
}

