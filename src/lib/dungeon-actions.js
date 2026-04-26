'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

// Fixed dungeon order
const DUNGEON_ORDER = [
    { key: '01_fire', name: 'Fire Particle Dungeon', image: '/dungeon/01_fire_particle_dungeon.webp' },
    { key: '02_water', name: 'Water Particle Dungeon', image: '/dungeon/02_water_particle_dungeon.webp' },
    { key: '03_earth', name: 'Earth Particle Dungeon', image: '/dungeon/03_earth_particle_dungeon.webp' },
    { key: '04_light', name: 'Light Particle Dungeon', image: '/dungeon/04_light_particle_dungeon.webp' },
    { key: '05_darkness', name: 'Darkness Particle Dungeon', image: '/dungeon/05_darkness_particle_dungeon.webp' },
    { key: '06_gold', name: 'Gold Particle Dungeon', image: '/dungeon/06_gold_particle_dungeon.webp' },
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
            : (row.heroes_json || []),
        skill_rotation: typeof row.skill_rotation === 'string'
            ? JSON.parse(row.skill_rotation)
            : (row.skill_rotation || [])
    }))
}

import { validateData, DungeonSetSchema } from './validation'

export async function createSet(data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(DungeonSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    
    try {
        // Get next set_index for this dungeon
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM dungeon_sets WHERE dungeon_key = ?',
            [validatedData.dungeon_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO dungeon_sets (dungeon_key, set_index, team_name, formation, pet_file, aura, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                validatedData.dungeon_key, 
                nextIndex, 
                validatedData.team_name || null,
                validatedData.formation, 
                validatedData.pet_file || null, 
                validatedData.aura || null,
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.skill_rotation), 
                validatedData.video_url, 
                validatedData.note
            ]
        )

        const dungeonName = DUNGEON_ORDER.find(d => d.key === validatedData.dungeon_key)?.name || validatedData.dungeon_key;
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
        await logSiteUpdate('DUNGEON', dungeonName, 'CREATE', `Added team${teamLabel} for ${dungeonName}`);

        revalidatePath('/admin/dungeon')
        revalidatePath(`/admin/dungeon/${validatedData.dungeon_key}`)
        revalidatePath('/dungeon')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(DungeonSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await pool.query(
            `UPDATE dungeon_sets 
             SET team_name = ?, formation = ?, pet_file = ?, aura = ?, heroes_json = ?, skill_rotation = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [
                validatedData.team_name || null,
                validatedData.formation, 
                validatedData.pet_file || null, 
                validatedData.aura || null,
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.skill_rotation), 
                validatedData.video_url, 
                validatedData.note, 
                id
            ]
        )

        const [rows] = await pool.query('SELECT dungeon_key FROM dungeon_sets WHERE id = ?', [id]);
        if (rows.length > 0) {
            const dungeonName = DUNGEON_ORDER.find(d => d.key === rows[0].dungeon_key)?.name || 'Dungeon';
            const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
            await logSiteUpdate('DUNGEON', dungeonName, 'UPDATE', `Updated team${teamLabel} for ${dungeonName}`);
        }

        revalidatePath('/admin/dungeon')
        revalidatePath('/dungeon')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    await requireAdmin()
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
