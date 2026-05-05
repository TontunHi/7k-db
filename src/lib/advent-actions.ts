'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'
import { validateData, AdventSetSchema, type AdventSet as AdventSetInput } from './validation'
import { type AdventSet, type ActionResponse } from './types'
import { type ResultSetHeader, type RowDataPacket } from 'mysql2'

// Fixed boss order
const BOSS_ORDER = [
    { key: 'ae_teo', name: 'Teo', image: '/advent_expedition/ae_teo.webp' },
    { key: 'ae_kyle', name: 'Kyle', image: '/advent_expedition/ae_kyle.webp' },
    { key: 'ae_yeonhee', name: 'Yeonhee', image: '/advent_expedition/ae_yeonhee.webp' },
    { key: 'ae_karma', name: 'Karma', image: '/advent_expedition/ae_karma.webp' },
    { key: 'ae_god_of_destruction', name: 'God Of Destruction', image: '/advent_expedition/ae_god_of_destruction.webp' },
]

export async function getBosses() {
    await initDB()
    
    const [rows] = await pool.query<({ boss_key: string; set_count: number })[] & RowDataPacket[]>(
        'SELECT boss_key, COUNT(*) as set_count FROM advent_expedition_sets GROUP BY boss_key'
    )
    const countMap = new Map(rows.map(r => [r.boss_key, Number(r.set_count)]))
    
    return BOSS_ORDER.map(boss => ({
        ...boss,
        setCount: countMap.get(boss.key) || 0
    }))
}

export async function getBossInfo(bossKey: string) {
    return BOSS_ORDER.find(b => b.key === bossKey) || null
}

export async function getSetsByBoss(bossKey: string) {
    await initDB()
    const [rows] = await pool.query<AdventSet[] & RowDataPacket[]>(
        'SELECT * FROM advent_expedition_sets WHERE boss_key = ? ORDER BY set_index ASC',
        [bossKey]
    )
    
    return rows.map(row => {
        const parseJSON = (val: any) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val) } catch { return [] }
            }
            return val || []
        }
        return {
            ...row,
            heroes: parseJSON(row.heroes_json),
            skill_rotation: parseJSON(row.skill_rotation),
            hero_builds: parseJSON(row.hero_builds_json),
        }
    })
}

export async function createSet(data: AdventSetInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(AdventSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    
    try {
        const [countResult] = await pool.query<({ next_index: number })[] & RowDataPacket[]>(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM advent_expedition_sets WHERE boss_key = ?',
            [validatedData.boss_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO advent_expedition_sets 
             (boss_key, phase, set_index, team_name, formation, pet_file, heroes_json, skill_rotation, hero_builds_json, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                validatedData.boss_key, validatedData.phase || 'Phase 1', nextIndex, validatedData.team_name || null,
                validatedData.formation, validatedData.pet_file || null, JSON.stringify(validatedData.heroes), JSON.stringify(validatedData.skill_rotation),
                JSON.stringify(validatedData.hero_builds || {}), validatedData.video_url, validatedData.note
            ]
        )

        const bossName = BOSS_ORDER.find(b => b.key === validatedData.boss_key)?.name || validatedData.boss_key;
        await logSiteUpdate('ADVENT', validatedData.team_name || bossName, 'CREATE', `Added strategy for ${bossName}${validatedData.team_name ? ` (${validatedData.team_name})` : ''}`);

        revalidatePath('/admin/advent')
        revalidatePath(`/admin/advent/${validatedData.boss_key}`)
        revalidatePath('/advent')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id: number, data: AdventSetInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(AdventSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await pool.query(
            `UPDATE advent_expedition_sets 
             SET phase = ?, team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, skill_rotation = ?,
                 hero_builds_json = ?, video_url = ?, note = ?
             WHERE id = ?`,
            [
                validatedData.phase || 'Phase 1', validatedData.team_name || null,
                validatedData.formation, validatedData.pet_file || null, JSON.stringify(validatedData.heroes), JSON.stringify(validatedData.skill_rotation),
                 JSON.stringify(validatedData.hero_builds || {}), validatedData.video_url, validatedData.note, id
            ]
        )

        const [rows] = await pool.query<AdventSet[]>('SELECT boss_key FROM advent_expedition_sets WHERE id = ?', [id]);
        if (rows.length > 0) {
            const bossName = BOSS_ORDER.find(b => b.key === rows[0].boss_key)?.name || 'Advent Boss';
            await logSiteUpdate('ADVENT', validatedData.team_name || bossName, 'UPDATE', `Updated strategy for ${bossName}${validatedData.team_name ? ` (${validatedData.team_name})` : ''}`);
        }

        revalidatePath('/admin/advent')
        revalidatePath('/advent')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id: number): Promise<ActionResponse> {
    await requireAdmin()
    try {
        await pool.query('DELETE FROM advent_expedition_sets WHERE id = ?', [id])
        
        revalidatePath('/admin/advent')
        revalidatePath('/advent')
        
        return { success: true }
    } catch (error) {
        console.error("Delete Set Error:", error)
        return { success: false, error: error.message }
    }
}
