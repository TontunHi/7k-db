'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'
import { validateData, TotalWarSetSchema, TotalWarTeamSchema } from './validation'

// ─── Sets ────────────────────────────────────────────────────────────────────

/** Get all sets for a given tier, including their teams */
export async function getSetsByTier(tier) {
    await initDB()

    const [sets] = await pool.query(
        'SELECT * FROM total_war_sets WHERE tier = ? ORDER BY set_index ASC',
        [tier]
    )

    const [teams] = await pool.query(
        `SELECT t.* FROM total_war_teams t
         JOIN total_war_sets s ON t.set_id = s.id
         WHERE s.tier = ?
         ORDER BY t.set_id ASC, t.team_index ASC`,
        [tier]
    )

    // Group teams into sets
    return sets.map(set => ({
        ...set,
        teams: teams
            .filter(t => t.set_id === set.id)
            .map(t => ({
                ...t,
                heroes: typeof t.heroes_json === 'string' ? JSON.parse(t.heroes_json) : (t.heroes_json || []),
                skill_rotation: typeof t.skill_rotation === 'string' ? JSON.parse(t.skill_rotation) : (t.skill_rotation || []),
            }))
    }))
}

/** Get set counts per tier (for index page badges) */
export async function getAllSetCounts() {
    await initDB()
    const [rows] = await pool.query(
        'SELECT tier, COUNT(*) as set_count FROM total_war_sets GROUP BY tier'
    )
    const map = {}
    rows.forEach(r => { map[r.tier] = Number(r.set_count) })
    return map
}

export async function createSet(data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(TotalWarSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    try {
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM total_war_sets WHERE tier = ?',
            [validatedData.tier]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO total_war_sets (tier, set_index, set_name, note) VALUES (?, ?, ?, ?)`,
            [validatedData.tier, nextIndex, validatedData.set_name || null, validatedData.note || null]
        )

        const tierLabel = validatedData.tier.charAt(0).toUpperCase() + validatedData.tier.slice(1)
        const setLabel = validatedData.set_name ? ` "${validatedData.set_name}"` : ` Set`
        await logSiteUpdate('TOTAL_WAR', tierLabel, 'CREATE', `Added Total War ${tierLabel}${setLabel}`)

        revalidatePath('/admin/total-war')
        revalidatePath(`/admin/total-war/${validatedData.tier}`)
        revalidatePath('/total-war')
        revalidatePath(`/total-war/${validatedData.tier}`)

        return { success: true, id: result.insertId }
    } catch (error) {
        console.error('Create Total War Set Error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    await requireAdmin()
    
    // Validate data (partial because update might not include all fields)
    const validation = validateData(TotalWarSetSchema.omit({ tier: true }).partial(), data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await pool.query(
            `UPDATE total_war_sets SET set_name = ?, note = ? WHERE id = ?`,
            [validatedData.set_name || null, validatedData.note || null, id]
        )

        // Query tier from DB since it's not in the update payload
        const [rows] = await pool.query('SELECT tier FROM total_war_sets WHERE id = ?', [id])
        const tier = rows[0]?.tier || 'total war'
        const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
        const setLabel = validatedData.set_name ? ` "${validatedData.set_name}"` : ' Set'
        await logSiteUpdate('TOTAL_WAR', tierLabel, 'UPDATE', `Updated Total War ${tierLabel}${setLabel}`)

        revalidatePath('/admin/total-war')
        revalidatePath('/total-war')
        return { success: true }
    } catch (error) {
        console.error('Update Total War Set Error:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    await requireAdmin()
    try {
        // teams are deleted via CASCADE
        await pool.query('DELETE FROM total_war_sets WHERE id = ?', [id])
        revalidatePath('/admin/total-war')
        revalidatePath('/total-war')
        return { success: true }
    } catch (error) {
        console.error('Delete Total War Set Error:', error)
        return { success: false, error: error.message }
    }
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function createTeam(data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(TotalWarTeamSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(team_index), 0) + 1 as next_index FROM total_war_teams WHERE set_id = ?',
            [validatedData.set_id]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO total_war_teams (set_id, team_index, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                validatedData.set_id,
                nextIndex,
                validatedData.team_name || null,
                validatedData.formation,
                validatedData.pet_file || null,
                JSON.stringify(validatedData.heroes),
                JSON.stringify(validatedData.skill_rotation),
                validatedData.video_url,
                validatedData.note,
            ]
        )

        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ' Team'
        await logSiteUpdate('TOTAL_WAR', 'Team', 'CREATE', `Added Total War${teamLabel}`)

        revalidatePath('/admin/total-war')
        revalidatePath('/total-war')

        return { success: true, id: result.insertId }
    } catch (error) {
        console.error('Create Total War Team Error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateTeam(id, data) {
    await requireAdmin()
    
    // Validate data (set_id is not changed during update)
    const validation = validateData(TotalWarTeamSchema.omit({ set_id: true }), data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await pool.query(
            `UPDATE total_war_teams
             SET team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [
                validatedData.team_name || null,
                validatedData.formation,
                validatedData.pet_file || null,
                JSON.stringify(validatedData.heroes),
                JSON.stringify(validatedData.skill_rotation),
                validatedData.video_url,
                validatedData.note,
                id,
            ]
        )
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ' Team'
        await logSiteUpdate('TOTAL_WAR', 'Team', 'UPDATE', `Updated Total War${teamLabel}`)

        revalidatePath('/admin/total-war')
        revalidatePath('/total-war')
        return { success: true }
    } catch (error) {
        console.error('Update Total War Team Error:', error)
        return { success: false, error: error.message }
    }
}

export async function deleteTeam(id) {
    await requireAdmin()
    try {
        await pool.query('DELETE FROM total_war_teams WHERE id = ?', [id])
        revalidatePath('/admin/total-war')
        revalidatePath('/total-war')
        return { success: true }
    } catch (error) {
        console.error('Delete Total War Team Error:', error)
        return { success: false, error: error.message }
    }
}
