'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

/** Get all global credits */
export async function getGlobalCredits() {
    await initDB()
    const [rows] = await pool.query('SELECT * FROM global_credits ORDER BY created_at DESC')
    return rows
}

/** Create a new global credit entry */
export async function createGlobalCredit(data) {
    await requireAdmin()
    // data: { platform, name, link }
    await initDB()
    try {
        const [result] = await pool.query(
            'INSERT INTO global_credits (platform, name, link) VALUES (?, ?, ?)',
            [data.platform || 'other', data.name, data.link]
        )

        await logSiteUpdate('CREDIT', data.name, 'CREATE', `Added attribution for ${data.name} (${data.platform})`)

        revalidatePath('/')
        revalidatePath('/admin/credits')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error('Create Global Credit Error:', error)
        return { success: false, error: error.message }
    }
}

/** Update an existing global credit entry */
export async function updateGlobalCredit(id, data) {
    await requireAdmin()
    try {
        await pool.query(
            'UPDATE global_credits SET platform = ?, name = ?, link = ? WHERE id = ?',
            [data.platform, data.name, data.link, id]
        )

        await logSiteUpdate('CREDIT', data.name, 'UPDATE', `Updated attribution for ${data.name}`)

        revalidatePath('/')
        revalidatePath('/admin/credits')
        
        return { success: true }
    } catch (error) {
        console.error('Update Global Credit Error:', error)
        return { success: false, error: error.message }
    }
}

/** Delete a global credit entry */
export async function deleteGlobalCredit(id) {
    await requireAdmin()
    try {
        const [rows] = await pool.query('SELECT name FROM global_credits WHERE id = ?', [id])
        const name = rows[0]?.name || 'Credit'

        await pool.query('DELETE FROM global_credits WHERE id = ?', [id])
        
        await logSiteUpdate('CREDIT', name, 'DELETE', `Removed attribution for ${name}`)

        revalidatePath('/')
        revalidatePath('/admin/credits')
        
        return { success: true }
    } catch (error) {
        console.error('Delete Global Credit Error:', error)
        return { success: false, error: error.message }
    }
}
