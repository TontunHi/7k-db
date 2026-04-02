'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'

export async function getArenaTeams() {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM arena_teams ORDER BY team_index ASC'
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

export async function createArenaTeam(data) {
    // data: { team_name, formation, pet_file, heroes: [], skill_rotation: [], video_url, note }
    await initDB()
    
    try {
        // Get next team_index
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(team_index), 0) + 1 as next_index FROM arena_teams'
        )
        const nextIndex = countResult[0].next_index

        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        const [result] = await pool.query(
            `INSERT INTO arena_teams (team_index, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nextIndex, data.team_name || null, data.formation, data.pet_file, JSON.stringify(slugifiedHeroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note]
        )

        await logSiteUpdate('ARENA', data.team_name || 'Arena Team', 'CREATE', `Added new Arena Team${data.team_name ? `: ${data.team_name}` : ''}`)

        revalidatePath('/admin/arena')
        revalidatePath('/arena')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Arena Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateArenaTeam(id, data) {
    try {
        const slugifiedHeroes = (data.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)

        await pool.query(
            `UPDATE arena_teams 
             SET team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [data.team_name || null, data.formation, data.pet_file, JSON.stringify(slugifiedHeroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note, id]
        )

        await logSiteUpdate('ARENA', data.team_name || 'Arena Team', 'UPDATE', `Updated Arena Team${data.team_name ? `: ${data.team_name}` : ''}`)

        revalidatePath('/admin/arena')
        revalidatePath('/arena')
        
        return { success: true }
    } catch (error) {
        console.error("Update Arena Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteArenaTeam(id) {
    try {
        await pool.query('DELETE FROM arena_teams WHERE id = ?', [id])
        
        revalidatePath('/admin/arena')
        revalidatePath('/arena')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Arena Team Error:", error)
        return { success: false, error: error.message }
    }
}

export async function reorderArenaTeams(orderedIds) {
    try {
        // Update batch in a transaction or individual queries (individual for simplicity since it's a small list)
        for (let i = 0; i < orderedIds.length; i++) {
            await pool.query(
                'UPDATE arena_teams SET team_index = ? WHERE id = ?',
                [i + 1, orderedIds[i]]
            );
        }
        revalidatePath('/admin/arena')
        revalidatePath('/arena')
        return { success: true }
    } catch (error) {
        console.error("Reorder Arena Teams Error:", error)
        return { success: false, error: error.message }
    }
}
