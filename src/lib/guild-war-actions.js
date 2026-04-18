'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

export async function getGuildWarTeams(type = 'attacker') {
    await initDB()
    const query = type === 'all' 
        ? 'SELECT * FROM guild_war_teams ORDER BY team_index ASC'
        : 'SELECT * FROM guild_war_teams WHERE type = ? ORDER BY team_index ASC'
    const params = type === 'all' ? [] : [type]
    const [rows] = await pool.query(query, params)
    
    return rows.map(row => ({
        ...row,
        heroes: typeof row.heroes_json === 'string' 
            ? JSON.parse(row.heroes_json) 
            : (row.heroes_json || []),
        skill_rotation: typeof row.skill_rotation === 'string'
            ? JSON.parse(row.skill_rotation)
            : (row.skill_rotation || []),
        counters: typeof row.counters_json === 'string'
            ? JSON.parse(row.counters_json)
            : (row.counters_json || []),
        items: typeof row.items_json === 'string'
            ? JSON.parse(row.items_json)
            : (row.items_json || {}),
        pet_supports: typeof row.pet_supports_json === 'string'
            ? JSON.parse(row.pet_supports_json)
            : (row.pet_supports_json || []),
        selection_order: typeof row.selection_order_json === 'string'
            ? JSON.parse(row.selection_order_json)
            : (row.selection_order_json || []),
        counter_teams: typeof row.counter_teams_json === 'string'
            ? JSON.parse(row.counter_teams_json)
            : (row.counter_teams_json || [])
    }))
}

import { validateData, GuildWarTeamSchema } from './validation'

export async function createGuildWarTeam(data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(GuildWarTeamSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    
    try {
        // Get next team_index for this type
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(team_index), 0) + 1 as next_index FROM guild_war_teams WHERE type = ?',
            [validatedData.type]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO guild_war_teams (team_index, type, team_name, formation, pet_file, pet_supports_json, heroes_json, selection_order_json, skill_rotation, items_json, video_url, note, counters_json, counter_teams_json)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nextIndex, 
                validatedData.type || 'general', 
                validatedData.team_name || null, 
                validatedData.formation, 
                validatedData.pet_file || null,
                JSON.stringify(validatedData.pet_supports || []),
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.selection_order || []),
                JSON.stringify(validatedData.skill_rotation), 
                JSON.stringify(validatedData.items || {}),
                validatedData.video_url, 
                validatedData.note,
                JSON.stringify(validatedData.counters || []),
                JSON.stringify(validatedData.counter_teams || [])
            ]
        )

        const typeLabel = validatedData.type === 'attacker' ? 'Attacker' : 'Defender'
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
        await logSiteUpdate('GUILD_WAR', typeLabel, 'CREATE', `Added Guild War ${typeLabel} team${teamLabel}`)

        revalidatePath('/admin/guild-war')
        revalidatePath('/guild-war')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Guild War Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateGuildWarTeam(id, data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(GuildWarTeamSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await pool.query(
            `UPDATE guild_war_teams 
             SET type = ?, team_name = ?, formation = ?, pet_file = ?, pet_supports_json = ?, heroes_json = ?, selection_order_json = ?, skill_rotation = ?, items_json = ?, video_url = ?, note = ?, counters_json = ?, counter_teams_json = ?
             WHERE id = ?`,
            [
                validatedData.type || 'general', 
                validatedData.team_name || null, 
                validatedData.formation, 
                validatedData.pet_file || null,
                JSON.stringify(validatedData.pet_supports || []),
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.selection_order || []),
                JSON.stringify(validatedData.skill_rotation), 
                JSON.stringify(validatedData.items || {}),
                validatedData.video_url, 
                validatedData.note, 
                JSON.stringify(validatedData.counters || []),
                JSON.stringify(validatedData.counter_teams || []),
                id
            ]
        )

        const typeLabel = validatedData.type === 'attacker' ? 'Attacker' : 'Defender'
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
        await logSiteUpdate('GUILD_WAR', typeLabel, 'UPDATE', `Updated Guild War ${typeLabel} team${teamLabel}`)

        revalidatePath('/admin/guild-war')
        revalidatePath('/guild-war')
        
        return { success: true }
    } catch (error) {
        console.error("Update Guild War Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function getItemFiles() {
    try {
        const [rows] = await pool.query('SELECT image as filename, weapon_group, item_type FROM items')
        
        const weapons = rows.filter(r => r.item_type === 'Weapon')
        const armors = rows.filter(r => r.item_type === 'Armor')
        const accessories = rows.filter(r => r.item_type === 'Accessory')
        
        return { weapons, armors, accessories }
    } catch (e) {
        console.error("Error fetching items from DB:", e)
        // Fallback or empty
        return { weapons: [], armors: [], accessories: [] }
    }
}

export async function deleteGuildWarTeam(id) {
    await requireAdmin()
    try {
        await pool.query('DELETE FROM guild_war_teams WHERE id = ?', [id])
        
        revalidatePath('/admin/guild-war')
        revalidatePath('/guild-war')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Guild War Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function reorderGuildWarTeams(orderedIds) {
    await requireAdmin()
    try {
        for (let i = 0; i < orderedIds.length; i++) {
            await pool.query(
                'UPDATE guild_war_teams SET team_index = ? WHERE id = ?',
                [i + 1, orderedIds[i]]
            );
        }
        revalidatePath('/admin/guild-war')
        revalidatePath('/guild-war')
        return { success: true }
    } catch (error) {
        console.error("Reorder Guild War Teams Error:", error)
        return { success: false, error: error.message }
    }
}
