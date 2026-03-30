'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'

// Fixed boss order
const BOSS_ORDER = [
    { key: 'cr_rudy', name: 'Rudy', image: '/castle_rush/cr_rudy.png' },
    { key: 'cr_eileene', name: 'Eileene', image: '/castle_rush/cr_eileene.png' },
    { key: 'cr_rachel', name: 'Rachel', image: '/castle_rush/cr_rachel.png' },
    { key: 'cr_dellons', name: 'Dellons', image: '/castle_rush/cr_dellons.png' },
    { key: 'cr_jave', name: 'Jave', image: '/castle_rush/cr_jave.png' },
    { key: 'cr_spike', name: 'Spike', image: '/castle_rush/cr_spike.png' },
    { key: 'cr_kris', name: 'Kris', image: '/castle_rush/cr_kris.png' },
]

export async function getBosses() {
    await initDB()
    
    // Get set counts for each boss
    const [rows] = await pool.query(
        'SELECT boss_key, COUNT(*) as set_count FROM castle_rush_sets GROUP BY boss_key'
    )
    const countMap = new Map(rows.map(r => [r.boss_key, r.set_count]))
    
    return BOSS_ORDER.map(boss => ({
        ...boss,
        setCount: countMap.get(boss.key) || 0
    }))
}

export async function getBossInfo(bossKey) {
    return BOSS_ORDER.find(b => b.key === bossKey) || null
}

export async function getSetsByBoss(bossKey) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM castle_rush_sets WHERE boss_key = ? ORDER BY set_index ASC',
        [bossKey]
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

export async function createSet(data) {
    // data: { boss_key, team_name, formation, pet_file, heroes: [], skill_rotation: [], video_url, note }
    await initDB()
    
    try {
        // Get next set_index for this boss
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM castle_rush_sets WHERE boss_key = ?',
            [data.boss_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO castle_rush_sets (boss_key, set_index, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.boss_key, nextIndex, data.team_name || null, data.formation, data.pet_file, JSON.stringify(data.heroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note]
        )

        revalidatePath('/admin/castle-rush')
        revalidatePath(`/admin/castle-rush/${data.boss_key}`)
        revalidatePath('/castle-rush')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    try {
        await pool.query(
            `UPDATE castle_rush_sets 
             SET team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [data.team_name || null, data.formation, data.pet_file, JSON.stringify(data.heroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note, id]
        )

        revalidatePath('/admin/castle-rush')
        revalidatePath('/castle-rush')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    try {
        await pool.query('DELETE FROM castle_rush_sets WHERE id = ?', [id])
        
        revalidatePath('/admin/castle-rush')
        revalidatePath('/castle-rush')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Set Error:", error)
        return { success: false, error: error.message }
    }
}
