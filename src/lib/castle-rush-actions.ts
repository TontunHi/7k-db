'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'
import { validateData, CastleRushSetSchema, type CastleRushSet as CastleRushSetInput } from './validation'
import { type CastleRushSet, type ActionResponse } from './types'
import { type ResultSetHeader, type RowDataPacket } from 'mysql2'

// Fixed boss order
const BOSS_ORDER = [
    { key: 'cr_rudy', name: 'Rudy', image: '/castle_rush/cr_rudy.webp' },
    { key: 'cr_eileene', name: 'Eileene', image: '/castle_rush/cr_eileene.webp' },
    { key: 'cr_rachel', name: 'Rachel', image: '/castle_rush/cr_rachel.webp' },
    { key: 'cr_dellons', name: 'Dellons', image: '/castle_rush/cr_dellons.webp' },
    { key: 'cr_jave', name: 'Jave', image: '/castle_rush/cr_jave.webp' },
    { key: 'cr_spike', name: 'Spike', image: '/castle_rush/cr_spike.webp' },
    { key: 'cr_kris', name: 'Kris', image: '/castle_rush/cr_kris.webp' },
]

export async function getBosses() {
    await initDB()
    
    // Get set counts for each boss
    const [rows] = await pool.query<({ boss_key: string; set_count: number })[] & RowDataPacket[]>(
        'SELECT boss_key, COUNT(*) as set_count FROM castle_rush_sets GROUP BY boss_key'
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

async function ensureHeroBuildsColumn() {
    try {
        const [check] = await pool.query<any[]>(
            'SHOW COLUMNS FROM castle_rush_sets LIKE "hero_builds_json"'
        )
        if (check.length === 0) {
            console.log("[DB PATCH] Adding hero_builds_json column to castle_rush_sets...")
            await pool.query('ALTER TABLE castle_rush_sets ADD COLUMN hero_builds_json JSON AFTER heroes_json')
        }

        const [checkOrder] = await pool.query<any[]>(
            'SHOW COLUMNS FROM castle_rush_sets LIKE "selection_order_json"'
        )
        if (checkOrder.length === 0) {
            console.log("[DB PATCH] Adding selection_order_json column to castle_rush_sets...")
            await pool.query('ALTER TABLE castle_rush_sets ADD COLUMN selection_order_json JSON AFTER hero_builds_json')
        }

        // Check team_name
        const [checkTeamName] = await pool.query<any[]>(
            'SHOW COLUMNS FROM castle_rush_sets LIKE "team_name"'
        )
        if (checkTeamName.length === 0) {
            console.log("[DB PATCH] Adding team_name column to castle_rush_sets...")
            await pool.query('ALTER TABLE castle_rush_sets ADD COLUMN team_name VARCHAR(100) NULL AFTER set_index')
        }
    } catch (e: any) {
        console.warn("[DB PATCH] Could not ensure table columns:", e.message)
    }
}

export async function getSetsByBoss(bossKey: string) {
    await initDB()
    await ensureHeroBuildsColumn()
    const [rows] = await pool.query<CastleRushSet[]>(
        'SELECT * FROM castle_rush_sets WHERE boss_key = ? ORDER BY set_index ASC',
        [bossKey]
    )
    
    return rows.map(row => ({
        ...row,
        heroes: typeof row.heroes_json === 'string' 
            ? JSON.parse(row.heroes_json) 
            : (row.heroes_json || []),
        hero_builds: typeof row.hero_builds_json === 'string'
            ? JSON.parse(row.hero_builds_json)
            : (row.hero_builds_json || {}),
        selection_order: typeof row.selection_order_json === 'string'
            ? JSON.parse(row.selection_order_json)
            : (row.selection_order_json || []),
        skill_rotation: typeof row.skill_rotation === 'string'
            ? JSON.parse(row.skill_rotation)
            : (row.skill_rotation || [])
    }))
}


export async function createSet(data: CastleRushSetInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(CastleRushSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data
    
    await initDB()
    await ensureHeroBuildsColumn()
    
    try {
        // Get next set_index for this boss
        const [countResult] = await pool.query<({ next_index: number })[] & RowDataPacket[]>(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM castle_rush_sets WHERE boss_key = ?',
            [validatedData.boss_key]
        )
        const nextIndex = countResult[0].next_index

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO castle_rush_sets (boss_key, set_index, team_name, formation, pet_file, heroes_json, hero_builds_json, selection_order_json, skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                validatedData.boss_key, 
                nextIndex, 
                validatedData.team_name || null, 
                validatedData.formation, 
                validatedData.pet_file || null, 
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.hero_builds || {}), 
                JSON.stringify(validatedData.selection_order || []),
                JSON.stringify(validatedData.skill_rotation), 
                validatedData.video_url, 
                validatedData.note
            ]
        )

        const bossName = BOSS_ORDER.find(b => b.key === validatedData.boss_key)?.name || validatedData.boss_key
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
        await logSiteUpdate('CASTLE_RUSH', bossName, 'CREATE', `Added Castle Rush team${teamLabel} for ${bossName}`)

        revalidatePath('/admin/castle-rush')
        revalidatePath(`/admin/castle-rush/${validatedData.boss_key}`)
        revalidatePath('/castle-rush')
        
        return { success: true, id: result.insertId }
    } catch (error: any) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id: number, data: CastleRushSetInput & { set_index?: number }): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(CastleRushSetSchema, data)
    if (!validation.success) return validation
    const validatedData = validation.data

    try {
        await initDB()
        await ensureHeroBuildsColumn()
        await pool.query(
            `UPDATE castle_rush_sets 
             SET team_name = ?, formation = ?, pet_file = ?, heroes_json = ?, hero_builds_json = ?, selection_order_json = ?, skill_rotation = ?, video_url = ?, note = ?, set_index = ?
             WHERE id = ?`,
            [
                validatedData.team_name || null, 
                validatedData.formation, 
                validatedData.pet_file || null, 
                JSON.stringify(validatedData.heroes), 
                JSON.stringify(validatedData.hero_builds || {}), 
                JSON.stringify(validatedData.selection_order || []),
                JSON.stringify(validatedData.skill_rotation), 
                validatedData.video_url, 
                validatedData.note, 
                data.set_index || 0,
                id
            ]
        )

        const bossName = validatedData.boss_name || 'Castle Rush'
        const teamLabel = validatedData.team_name ? ` "${validatedData.team_name}"` : ''
        await logSiteUpdate('CASTLE_RUSH', bossName, 'UPDATE', `Updated Castle Rush team${teamLabel} for ${bossName}`)

        revalidatePath('/admin/castle-rush')
        revalidatePath('/castle-rush')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id: number): Promise<ActionResponse> {
    await requireAdmin()
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
