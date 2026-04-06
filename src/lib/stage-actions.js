'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import { logSiteUpdate } from './log-actions'
import { requireAdmin } from './auth-guard'

// === DATABASE ACTIONS ===

export async function getStages(type = 'stage') {
    await initDB() // Ensure tables exist
    // Basic listing
    const [rows] = await pool.query(
        'SELECT * FROM stage_setups WHERE type = ? ORDER BY created_at DESC',
        [type]
    )
    return rows
}

export async function getStageById(id) {
    const [rows] = await pool.query('SELECT * FROM stage_setups WHERE id = ?', [id])
    if (rows.length === 0) return null
    const stage = rows[0]

    const [teams] = await pool.query('SELECT * FROM teams WHERE setup_id = ? ORDER BY team_index ASC', [id])

    // Parse JSON fields
    const parsedTeams = teams.map(t => ({
        ...t,
        heroes: typeof t.heroes_json === 'string' ? JSON.parse(t.heroes_json) : (t.heroes_json || [])
    }))

    return {
        ...stage,
        teams: parsedTeams
    }
}

export async function createStage(data) {
    await requireAdmin()
    // data: { type, name, note, teams: [{ index, formation, pet_file, heroes: [] }] }
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        const [res] = await connection.query(
            'INSERT INTO stage_setups (type, name, note) VALUES (?, ?, ?)',
            [data.type, data.name, data.note]
        )
        const setupId = res.insertId

        for (const team of data.teams) {
            const slugifiedHeroes = (team.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)
            await connection.query(
                `INSERT INTO teams (setup_id, team_index, formation, pet_file, heroes_json)
                 VALUES (?, ?, ?, ?, ?)`,
                [setupId, team.index, team.formation, team.pet_file, JSON.stringify(slugifiedHeroes)]
            )
        }

        await connection.commit()
        
        await logSiteUpdate('STAGE', data.name || 'Stage', 'CREATE', `Added stage guide: ${data.name || 'Stage'}`)
        
        revalidatePath('/admin/stages')
        revalidatePath('/stages')
        return { success: true, id: setupId }
    } catch (error) {
        await connection.rollback()
        console.error("Create Stage Error:", error)
        return { success: false, error: error.message }
    } finally {
        connection.release()
    }
}

export async function updateStage(id, data) {
    await requireAdmin()
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        await connection.query(
            'UPDATE stage_setups SET type = ?, name = ?, note = ? WHERE id = ?',
            [data.type, data.name, data.note, id]
        )

        // Replace teams logic
        await connection.query('DELETE FROM teams WHERE setup_id = ?', [id])

        for (const team of data.teams) {
            const slugifiedHeroes = (team.heroes || []).map(h => h ? h.replace(/\.[^/.]+$/, "") : null)
            await connection.query(
                `INSERT INTO teams (setup_id, team_index, formation, pet_file, heroes_json)
                 VALUES (?, ?, ?, ?, ?)`,
                [id, team.index, team.formation, team.pet_file, JSON.stringify(slugifiedHeroes)]
            )
        }

        await connection.commit()
        
        await logSiteUpdate('STAGE', data.name || 'Stage', 'UPDATE', `Updated stage guide: ${data.name || 'Stage'}`)
        
        revalidatePath('/admin/stages')
        revalidatePath('/stages')
        revalidatePath(`/admin/stages/${id}`)
        return { success: true }
    } catch (error) {
        await connection.rollback()
        console.error("Update Stage Error:", error)
        return { success: false, error: error.message }
    } finally {
        connection.release()
    }
}

export async function deleteStage(id) {
    await requireAdmin()
    try {
        await pool.query('DELETE FROM stage_setups WHERE id = ?', [id])
        revalidatePath('/admin/stages')
        revalidatePath('/stages')
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// === FILE UTILITIES ===

export async function getPets() {
    const petsDir = path.join(process.cwd(), 'public', 'pets')
    try {
        if (!fs.existsSync(petsDir)) return []
        const files = await fs.promises.readdir(petsDir)
        const validFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))

        // Sort by Grade (L > R)
        return validFiles.sort((a, b) => {
            const getRank = (name) => {
                const lower = name.toLowerCase()
                if (lower.startsWith('l_')) return 2
                if (lower.startsWith('r_')) return 1
                return 0
            }
            const rankA = getRank(a)
            const rankB = getRank(b)
            if (rankA !== rankB) return rankB - rankA
            return a.localeCompare(b)
        }).map(f => `/pets/${f}`)
    } catch (error) {
        console.error("Error reading pets:", error)
        return []
    }
}

export async function getFormations() {
    const formDir = path.join(process.cwd(), 'public', 'formation')
    try {
        if (!fs.existsSync(formDir)) return []
        const files = await fs.promises.readdir(formDir)
        return files
            .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
            .sort() // 1-4, 2-3, 3-2, 4-1
            .map(f => ({
                name: f.replace(/\.[^/.]+$/, "").replace("-", " - "),
                value: f.replace(/\.[^/.]+$/, ""),
                image: `/formation/${f}`
            }))
    } catch (error) {
        console.error("Error reading formations:", error)
        return []
    }
}

export async function getAllHeroes() {
    const heroesDir = path.join(process.cwd(), 'public', 'heroes')
    try {
        await initDB()

        // 1. Get all files
        if (!fs.existsSync(heroesDir)) return []
        const files = await fs.promises.readdir(heroesDir)
        const heroFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))

        // 2. Get DB data for Grades
        const [dbHeroes] = await pool.query("SELECT filename as slug, name, grade FROM heroes")
        const dbMap = new Map(dbHeroes.map(h => [h.slug, h]))

        // 3. Merge
        const combined = heroFiles.map(filename => {
            const slug = filename.replace(/\.[^/.]+$/, "")
            const dbData = dbMap.get(slug)
            // Use DB data if valid, else derive from filename
            const displayName = dbData?.name || slug.replace(/_/g, " ")
            let grade = dbData?.grade
            if (!grade) {
                const match = filename.match(/^(l\+\+|l\+|l|r|uc|c)_/i)
                grade = match ? match[1].toLowerCase() : 'N/A'
            }

            return {
                filename,
                name: displayName,
                grade: grade
            }
        })

        // 4. Sort (Grade Descending, then Name)
        // Order: L++ > L+ > L > R > UC > C
        const gradeOrder = { 'l++': 6, 'l+': 5, 'l': 4, 'r': 3, 'uc': 2, 'c': 1 }

        return combined.sort((a, b) => {
            const gradeA = gradeOrder[a.grade?.toLowerCase()] || 0
            const gradeB = gradeOrder[b.grade?.toLowerCase()] || 0

            if (gradeA !== gradeB) return gradeB - gradeA // Higher grade first
            return a.name.localeCompare(b.name)
        })

    } catch (error) {
        console.error("Error getting all heroes:", error)
        return []
    }
}

export async function getAllSkills() {
    const skillsDir = path.join(process.cwd(), 'public', 'skills')
    try {
        if (!fs.existsSync(skillsDir)) return []
        const folders = await fs.promises.readdir(skillsDir)
        
        let allSkills = []
        for (const folder of folders) {
            const folderPath = path.join(skillsDir, folder)
            const stat = await fs.promises.stat(folderPath)
            if (stat.isDirectory()) {
                const files = await fs.promises.readdir(folderPath)
                const validFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
                for (const file of validFiles) {
                    allSkills.push({
                        folder,
                        filename: file,
                        path: `/skills/${folder}/${file}`
                    })
                }
            }
        }
        
        const gradeOrder = { 'l++': 6, 'l+': 5, 'l': 4, 'r': 3, 'uc': 2, 'c': 1 }
        allSkills.sort((a, b) => {
            const getGrade = f => f.match(/^(l\+\+|l\+|l|r|uc|c)_/i)?.[1].toLowerCase() || ''
            const gA = gradeOrder[getGrade(a.folder)] || 0
            const gB = gradeOrder[getGrade(b.folder)] || 0
            if (gA !== gB) return gB - gA
            if (a.folder !== b.folder) return a.folder.localeCompare(b.folder)
            
            // Sort skill numbers properly (1.png before 10.png)
            const numA = parseInt(a.filename) || 0
            const numB = parseInt(b.filename) || 0
            if (numA !== numB) return numA - numB
            return a.filename.localeCompare(b.filename)
        })
        
        return allSkills
    } catch (error) {
        console.error("Error reading skills:", error)
        return []
    }
}

export async function getHeroProfile(id) {
    await initDB()
    const slug = id.replace(/\.[^/.]+$/, "")
    
    // 1. Basic Data
    const [heroRows] = await pool.query('SELECT * FROM heroes WHERE filename = ?', [slug])
    const hero = heroRows[0] || { filename: slug, name: slug.replace(/_/g, ' '), grade: 'N/A' }
    
    // 2. Builds
    const [buildRows] = await pool.query('SELECT * FROM builds WHERE hero_filename = ?', [slug])
    const builds = buildRows.map(b => ({
        ...b,
        modes: typeof b.modes === 'string' ? JSON.parse(b.modes) : (b.modes || []),
        weapons: typeof b.weapons === 'string' ? JSON.parse(b.weapons) : (b.weapons || []),
        armors: typeof b.armors === 'string' ? JSON.parse(b.armors) : (b.armors || []),
        accessories: typeof b.accessories === 'string' ? JSON.parse(b.accessories) : (b.accessories || []),
        substats: typeof b.substats === 'string' ? JSON.parse(b.substats) : (b.substats || [])
    }))

    // 3. Skills
    const heroFolder = id.replace(/\.[^/.]+$/, "")
    const skillsDir = path.join(process.cwd(), 'public', 'skills', heroFolder)
    let skillImages = []
    if (fs.existsSync(skillsDir)) {
        const files = await fs.promises.readdir(skillsDir)
        skillImages = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).map(f => `/skills/${heroFolder}/${f}`)
    }

    // 4. Cross References (Where is this hero used?)
    const usedIn = []

    // Helper to check JSON column for slug
    const checkTeam = (teamJson, targetSlug) => {
        const heroes = typeof teamJson === 'string' ? JSON.parse(teamJson) : (teamJson || [])
        return heroes.includes(targetSlug)
    }

    // Simple LIKE search is easier for cross-reference at this scale
    const pattern = `%${slug}%`

    // Castle Rush
    const [cr] = await pool.query('SELECT boss_key, team_name FROM castle_rush_sets WHERE heroes_json LIKE ?', [pattern])
    cr.forEach(item => usedIn.push({ type: 'Castle Rush', name: item.team_name || item.boss_key, link: `/castle-rush/${item.boss_key}` }))

    // Raid
    const [raid] = await pool.query('SELECT raid_key FROM raid_sets WHERE heroes_json LIKE ?', [pattern])
    raid.forEach(item => usedIn.push({ type: 'Raid', name: item.raid_key, link: `/raid/${item.raid_key}` }))

    // Dungeon
    const [dungeon] = await pool.query('SELECT dungeon_key FROM dungeon_sets WHERE heroes_json LIKE ?', [pattern])
    dungeon.forEach(item => usedIn.push({ type: 'Dungeon', name: item.dungeon_key, link: `/dungeon/${item.dungeon_key}` }))

    // Advent
    const [advent] = await pool.query('SELECT boss_key, team_name FROM advent_expedition_sets WHERE team1_heroes_json LIKE ? OR team2_heroes_json LIKE ?', [pattern, pattern])
    advent.forEach(item => usedIn.push({ type: 'Advent', name: item.team_name || item.boss_key, link: `/advent/${item.boss_key}` }))

    // Arena
    const [arena] = await pool.query('SELECT team_name FROM arena_teams WHERE heroes_json LIKE ?', [pattern])
    if (arena.length > 0) usedIn.push({ type: 'Arena', name: 'Recommended Teams', link: '/arena' })

    // Stages
    const [stages] = await pool.query(`
        SELECT DISTINCT s.id, s.name 
        FROM stage_setups s 
        JOIN teams t ON s.id = t.setup_id 
        WHERE t.heroes_json LIKE ?`, [pattern])
    stages.forEach(item => usedIn.push({ type: 'Stage Guide', name: item.name, link: `/stages?id=${item.id}` }))

    return {
        ...hero,
        builds,
        skills: skillImages,
        usedIn: usedIn.filter((v, i, a) => a.findIndex(t => (t.type === v.type && t.name === v.name)) === i) // Unique references
    }
}
