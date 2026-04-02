'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'

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
    // data: { tier, set_name, note }
    await initDB()
    try {
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM total_war_sets WHERE tier = ?',
            [data.tier]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO total_war_sets (tier, set_index, set_name, note) VALUES (?, ?, ?, ?)`,
            [data.tier, nextIndex, data.set_name || null, data.note || null]
        )

        const tierLabel = data.tier.charAt(0).toUpperCase() + data.tier.slice(1)
        const setLabel = data.set_name ? ` "${data.set_name}"` : ` Set`
        await logSiteUpdate('TOTAL_WAR', tierLabel, 'CREATE', `Added Total War ${tierLabel}${setLabel}`)

        revalidatePath('/admin/total-war')
        revalidatePath(`/admin/total-war/${data.tier}`)
        revalidatePath('/total-war')
        revalidatePath(`/total-war/${data.tier}`)

        return { success: true, id: result.insertId }
    } catch (error) {
        console.error('Create Total War Set Error:', error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    try {
        await pool.query(
            `UPDATE total_war_sets SET set_name = ?, note = ? WHERE id = ?`,
            [data.set_name || null, data.note || null, id]
        )

        // Query tier from DB since it's not in the update payload
        const [rows] = await pool.query('SELECT tier FROM total_war_sets WHERE id = ?', [id])
        const tier = rows[0]?.tier || 'total war'
        const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
        const setLabel = data.set_name ? ` "${data.set_name}"` : ' Set'
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
    // data: { set_id, team_name, formation, pet_file, heroes, skill_rotation, video_url, note }
    try {
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(team_index), 0) + 1 as next_index FROM total_war_teams WHERE set_id = ?',
            [data.set_id]
        )
        const nextIndex = countResult[0].next_index

        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        const [result] = await pool.query(
            `INSERT INTO total_war_teams (set_id, team_index, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.set_id,
                nextIndex,
                data.team_name || null,
                data.formation,
                data.pet_file,
                JSON.stringify(slugifiedHeroes),
                JSON.stringify(data.skill_rotation || []),
                data.video_url,
                data.note,
            ]
        )

        const teamLabel = data.team_name ? ` "${data.team_name}"` : ' Team'
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
    try {
        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        await pool.query(
            `UPDATE total_war_teams
             SET team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [
                data.team_name || null,
                data.formation,
                data.pet_file,
                JSON.stringify(slugifiedHeroes),
                JSON.stringify(data.skill_rotation || []),
                data.video_url,
                data.note,
                id,
            ]
        )
        const teamLabel = data.team_name ? ` "${data.team_name}"` : ' Team'
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
