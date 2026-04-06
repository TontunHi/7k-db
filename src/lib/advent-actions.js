'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

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
    
    const [rows] = await pool.query(
        'SELECT boss_key, COUNT(*) as set_count FROM advent_expedition_sets GROUP BY boss_key'
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
        'SELECT * FROM advent_expedition_sets WHERE boss_key = ? ORDER BY set_index ASC',
        [bossKey]
    )
    
    return rows.map(row => {
        const parseJSON = (val) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val) } catch { return [] }
            }
            return val || []
        }
        return {
            ...row,
            team1_heroes: parseJSON(row.team1_heroes_json),
            team1_skill_rotation: parseJSON(row.team1_skill_rotation),
            team2_heroes: parseJSON(row.team2_heroes_json),
            team2_skill_rotation: parseJSON(row.team2_skill_rotation),
        }
    })
}

export async function createSet(data) {
    await requireAdmin()
    await initDB()
    
    try {
        const [countResult] = await pool.query(
            'SELECT COALESCE(MAX(set_index), 0) + 1 as next_index FROM advent_expedition_sets WHERE boss_key = ?',
            [data.boss_key]
        )
        const nextIndex = countResult[0].next_index

        const slugifyTeam = (heroes) => (heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)
        const team1Slugs = slugifyTeam(data.team1_heroes)
        const team2Slugs = slugifyTeam(data.team2_heroes)

        const [result] = await pool.query(
            `INSERT INTO advent_expedition_sets 
             (boss_key, set_index, team_name, team1_formation, team1_pet_file, team1_heroes_json, team1_skill_rotation, team2_formation, team2_pet_file, team2_heroes_json, team2_skill_rotation, video_url, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.boss_key, nextIndex, data.team_name,
                data.team1_formation, data.team1_pet_file, JSON.stringify(team1Slugs), JSON.stringify(data.team1_skill_rotation || []),
                data.team2_formation, data.team2_pet_file, JSON.stringify(team2Slugs), JSON.stringify(data.team2_skill_rotation || []),
                data.video_url, data.note
            ]
        )

        const bossName = BOSS_ORDER.find(b => b.key === data.boss_key)?.name || 'Advent Boss';
        await logSiteUpdate('ADVENT', data.team_name || bossName, 'CREATE', `Added strategy for ${bossName}${data.team_name ? ` (${data.team_name})` : ''}`);

        revalidatePath('/admin/advent')
        revalidatePath(`/admin/advent/${data.boss_key}`)
        revalidatePath('/advent')
        
        return { success: true, id: result.insertId }
    } catch (error) {
        console.error("Create Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateSet(id, data) {
    await requireAdmin()
    try {
        const slugifyTeam = (heroes) => (heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)
        const team1Slugs = slugifyTeam(data.team1_heroes)
        const team2Slugs = slugifyTeam(data.team2_heroes)

        await pool.query(
            `UPDATE advent_expedition_sets 
             SET team_name = ?, team1_formation = ?, team1_pet_file = ?, team1_heroes_json = ?, team1_skill_rotation = ?,
                 team2_formation = ?, team2_pet_file = ?, team2_heroes_json = ?, team2_skill_rotation = ?,
                 video_url = ?, note = ?
             WHERE id = ?`,
            [
                data.team_name,
                data.team1_formation, data.team1_pet_file, JSON.stringify(team1Slugs), JSON.stringify(data.team1_skill_rotation || []),
                data.team2_formation, data.team2_pet_file, JSON.stringify(team2Slugs), JSON.stringify(data.team2_skill_rotation || []),
                data.video_url, data.note, id
            ]
        )

        const [rows] = await pool.query('SELECT boss_key FROM advent_expedition_sets WHERE id = ?', [id]);
        if (rows.length > 0) {
            const bossName = BOSS_ORDER.find(b => b.key === rows[0].boss_key)?.name || 'Advent Boss';
            await logSiteUpdate('ADVENT', data.team_name || bossName, 'UPDATE', `Updated strategy for ${bossName}${data.team_name ? ` (${data.team_name})` : ''}`);
        }

        revalidatePath('/admin/advent')
        revalidatePath('/advent')
        
        return { success: true }
    } catch (error) {
        console.error("Update Set Error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteSet(id) {
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
