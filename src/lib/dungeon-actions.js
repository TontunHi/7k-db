'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'

// Fixed dungeon order
const DUNGEON_ORDER = [
    { key: '01_fire', name: 'Fire Particle Dungeon', image: '/dungeon/01_fire_particle_dungeon.png' },
    { key: '02_water', name: 'Water Particle Dungeon', image: '/dungeon/02_water_particle_dungeon.png' },
    { key: '03_earth', name: 'Earth Particle Dungeon', image: '/dungeon/03_earth_particle_dungeon.png' },
    { key: '04_light', name: 'Light Particle Dungeon', image: '/dungeon/04_light_particle_dungeon.png' },
    { key: '05_darkness', name: 'Darkness Particle Dungeon', image: '/dungeon/05_darkness_particle_dungeon.png' },
    { key: '06_gold', name: 'Gold Particle Dungeon', image: '/dungeon/06_gold_particle_dungeon.png' },
]

export async function getDungeons() {
    await initDB()
    
    // Get set counts for each dungeon
    const [rows] = await pool.query(
        'SELECT dungeon_key, COUNT(*) as set_count FROM dungeon_sets GROUP BY dungeon_key'
    )
    const countMap = new Map(rows.map(r => [r.dungeon_key, r.set_count]))
    
    return DUNGEON_ORDER.map(d => ({
        ...d,
        setCount: countMap.get(d.key) || 0
    }))
}

export async function getDungeonInfo(dungeonKey) {
    return DUNGEON_ORDER.find(d => d.key === dungeonKey) || null
}

export async function getSetsByDungeon(dungeonKey) {
    await initDB()
    const [rows] = await pool.query(
        'SELECT * FROM dungeon_sets WHERE dungeon_key = ? ORDER BY set_index ASC',
        [dungeonKey]
    )
    
    return rows.map(row => ({
        ...row,
        heroes: typeof row.heroes_json === 'string' 
            ? JSON.parse(row.heroes_json) 
            : (row.heroes_json || [])
    }))
}

export async function createSet(data) {
    // data: { dungeon_key, formation, pet_file, heroes: [], video_url, note }
    await initDB()
    
    try {
        // Get next set_index for this dungeon
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM dungeon_sets WHERE dungeon_key = ?',
            [data.dungeon_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO dungeon_sets (dungeon_key, set_index, formation, pet_file, heroes_json, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.dungeon_key, nextIndex, data.formation, data.pet_file, JSON.stringify(data.heroes), data.video_url, data.note]
        )

        revalidatePath('/admin/dungeon')
        revalidatePath(`/admin/dungeon/${data.dungeon_key}`)
        revalidatePath('/dungeon')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    try {
        await pool.query(
            `UPDATE dungeon_sets 
             SET formation = ?, pet_file = ?, heroes_json = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [data.formation, data.pet_file, JSON.stringify(data.heroes), data.video_url, data.note, id]
        )

        revalidatePath('/admin/dungeon')
        revalidatePath('/dungeon')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    try {
        await pool.query('DELETE FROM dungeon_sets WHERE id = ?', [id])
        
        revalidatePath('/admin/dungeon')
        revalidatePath('/dungeon')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Set Error:", error)
        return { success: false, error: error.message }
    }
}
