'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'

// Raids with actual images - names derived from filenames
const RAID_ORDER = [
    { key: 'destroyer_gaze', name: 'Destroyer Gaze', image: '/raid/1_Destroyer_Gaze.png' },
    { key: 'ox_king', name: 'Ox King', image: '/raid/2_Ox_King.png' },
    { key: 'iron_devourer', name: 'Iron Devourer', image: '/raid/3_Iron_Devourer.png' },
]

export async function getRaids() {
    await initDB()
    
    // Get set counts for each raid
    const [rows] = await pool.query(
        'SELECT raid_key, COUNT(*) as set_count FROM raid_sets GROUP BY raid_key'
    )
    const countMap = new Map(rows.map(r => [r.raid_key, r.set_count]))
    
    return RAID_ORDER.map(r => ({
        ...r,
        setCount: countMap.get(r.key) || 0
    }))
}

export async function getRaidInfo(raidKey) {
    return RAID_ORDER.find(r => r.key === raidKey) || null
}

export async function getSetsByRaid(raidKey) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM raid_sets WHERE raid_key = ? ORDER BY set_index ASC',
        [raidKey]
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
    // data: { raid_key, formation, pet_file, heroes: [], skill_rotation: [], video_url, note }
    await initDB()
    
    try {
        // Get next set_index for this raid
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM raid_sets WHERE raid_key = ?',
            [data.raid_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO raid_sets (raid_key, set_index, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.raid_key, nextIndex, data.formation, data.pet_file, JSON.stringify(data.heroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note]
        )

        revalidatePath('/admin/raid')
        revalidatePath(`/admin/raid/${data.raid_key}`)
        revalidatePath('/raid')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    try {
        await pool.query(
            `UPDATE raid_sets 
             SET formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [data.formation, data.pet_file, JSON.stringify(data.heroes), JSON.stringify(data.skill_rotation || []), data.video_url, data.note, id]
        )

        revalidatePath('/admin/raid')
        revalidatePath('/raid')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    try {
        await pool.query('DELETE FROM raid_sets WHERE id = ?', [id])
        
        revalidatePath('/admin/raid')
        revalidatePath('/raid')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Set Error:", error)
        return { success: false, error: error.message }
    }
}
