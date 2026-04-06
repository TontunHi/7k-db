'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

export async function getGuildWarTeams(type = 'attacker') {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM guild_war_teams WHERE type = ? ORDER BY team_index ASC',
        [type]
    )
    
    return rows.map(row => ({
        ...row,
        heroes: typeof row.heroes_json === 'string' 
            ? JSON.parse(row.heroes_json) 
            : (row.heroes_json || []),
        skill_rotation: typeof row.skill_rotation === 'string'
            ? JSON.parse(row.skill_rotation)
            : (row.skill_rotation || [])
    }))
}

export async function createGuildWarTeam(data) {
    await requireAdmin()
    // data: { type, team_name, formation, pet_file, heroes: [], skill_rotation: [], video_url, note }
    await initDB()
    
    try {
        // Get next team_index for that type
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(team_index), 0) + 1 as next_index FROM guild_war_teams WHERE type = ?',
            [data.type]
        )
        const nextIndex = countResult[0].next_index

        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        const [result] = await pool.query(
            `INSERT INTO guild_war_teams (team_index, type, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nextIndex, data.type, data.team_name || null, data.formation, data.pet_file, JSON.stringify(slugifiedHeroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note]
        )

        const typeLabel = data.type === 'attacker' ? 'Attacker' : 'Defender'
        const teamLabel = data.team_name ? ` "${data.team_name}"` : ''
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
    try {
        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        await pool.query(
            `UPDATE guild_war_teams 
             SET type = ?, team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [data.type, data.team_name || null, data.formation, data.pet_file, JSON.stringify(slugifiedHeroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note, id]
        )

        const typeLabel = data.type === 'attacker' ? 'Attacker' : 'Defender'
        const teamLabel = data.team_name ? ` "${data.team_name}"` : ''
        await logSiteUpdate('GUILD_WAR', typeLabel, 'UPDATE', `Updated Guild War ${typeLabel} team${teamLabel}`)

        revalidatePath('/admin/guild-war')
        revalidatePath('/guild-war')
        
        return { success: true }
    } catch (error) {
        console.error("Update Guild War Team Error:", error)
        return { success: false, error: error.message }
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
