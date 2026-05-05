'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'
import { validateData, GlobalCreditSchema, type GlobalCredit as GlobalCreditInput } from './validation'
import { type GlobalCredit, type ActionResponse } from './types'
import { type ResultSetHeader } from 'mysql2'

/** Get all global credits */
export async function getGlobalCredits() {
    await initDB()
    const [rows] = await pool.query<GlobalCredit[]>('SELECT * FROM global_credits ORDER BY created_at DESC')
    return rows
}

/** Create a new global credit entry */
export async function createGlobalCredit(data: GlobalCreditInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(GlobalCreditSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO global_credits (platform, name, link) VALUES (?, ?, ?)',
            [validatedData.platform, validatedData.name, validatedData.link]
        )

        await logSiteUpdate('CREDIT', validatedData.name, 'CREATE', `Added attribution for ${validatedData.name} (${validatedData.platform})`)

        revalidatePath('/')
        revalidatePath('/admin/credits')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error('Create Global Credit Error:', error)
        return { success: false, error: error.message }
    }
}

/** Update an existing global credit entry */
export async function updateGlobalCredit(id: number, data: GlobalCreditInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(GlobalCreditSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    await initDB()
    try {
        await pool.query(
            'UPDATE global_credits SET platform = ?, name = ?, link = ? WHERE id = ?',
            [validatedData.platform, validatedData.name, validatedData.link, id]
        )

        await logSiteUpdate('CREDIT', validatedData.name, 'UPDATE', `Updated attribution for ${validatedData.name}`)

        revalidatePath('/')
        revalidatePath('/admin/credits')
        
        return { success: true }
    } catch (error) {
        console.error('Update Global Credit Error:', error)
        return { success: false, error: error.message }
    }
}

/** Delete a global credit entry */
export async function deleteGlobalCredit(id: number): Promise<ActionResponse> {
    await requireAdmin()
    await initDB()
    try {
        const [rows] = await pool.query<GlobalCredit[]>('SELECT name FROM global_credits WHERE id = ?', [id])
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
