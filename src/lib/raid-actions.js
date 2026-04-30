'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

// Raids with actual images - names derived from filenames
const RAID_ORDER = [
    { key: 'destroyer_gaze', name: 'Destroyer Gaze', image: '/raid/1_Destroyer_Gaze.webp' },
    { key: 'ox_king', name: 'Ox King', image: '/raid/2_Ox_King.webp' },
    { key: 'iron_devourer', name: 'Iron Devourer', image: '/raid/3_Iron_Devourer.webp' },
    { key: 'calistra', name: 'Calistra', image: '/raid/4_Calistra.webp' },
    { key: 'astra', name: 'Astra', image: '/raid/5_Astra.webp' },
    { key: 'leonid', name: 'Leonid', image: '/raid/6_Leonid.webp' },
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

import { validateData, RaidSetSchema } from './validation'

export async function createSet(data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(RaidSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    
    try {
        // Get next set_index for this raid
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM raid_sets WHERE raid_key = ?',
            [validatedData.raid_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query(
            `INSERT INTO raid_sets (raid_key, set_index, team_name, formation, pet_file, heroes_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                validatedData.raid_key, 
                nextIndex, 
                validatedData.team_name || null,
                validatedData.formation, 
                validatedData.pet_file || null, 
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.skill_rotation), 
                validatedData.video_url, 
                validatedData.note
            ]
        )

        const raidName = RAID_ORDER.find(r => r.key === validatedData.raid_key)?.name || validatedData.raid_key;
        await logSiteUpdate('RAID', raidName, 'CREATE', `Added new strategy for ${raidName}`);

        revalidatePath('/admin/raid')
        revalidatePath(`/admin/raid/${validatedData.raid_key}`)
        revalidatePath('/raid')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(RaidSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    await initDB()
    try {
        await pool.query(
            `UPDATE raid_sets 
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
                id
            ]
        )

        const [rows] = await pool.query('SELECT raid_key FROM raid_sets WHERE id = ?', [id]);
        if (rows.length > 0) {
            const raidName = RAID_ORDER.find(r => r.key === rows[0].raid_key)?.name || 'Raid';
            await logSiteUpdate('RAID', raidName, 'UPDATE', `Updated strategy for ${raidName}`);
        }

        revalidatePath('/admin/raid')
        revalidatePath('/raid')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
    await requireAdmin()
    await initDB()
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
