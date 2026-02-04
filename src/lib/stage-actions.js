'use server'

import pool, { initDB } from './db'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

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
            await connection.query(
                `INSERT INTO teams (setup_id, team_index, formation, pet_file, heroes_json)
                 VALUES (?, ?, ?, ?, ?)`,
                [setupId, team.index, team.formation, team.pet_file, JSON.stringify(team.heroes)]
            )
        }

        await connection.commit()
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
            await connection.query(
                `INSERT INTO teams (setup_id, team_index, formation, pet_file, heroes_json)
                 VALUES (?, ?, ?, ?, ?)`,
                [id, team.index, team.formation, team.pet_file, JSON.stringify(team.heroes)]
            )
        }

        await connection.commit()
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
        const [dbHeroes] = await pool.query("SELECT filename, name, grade FROM heroes")
        const dbMap = new Map(dbHeroes.map(h => [h.filename, h]))

        // 3. Merge
        const combined = heroFiles.map(filename => {
            const dbData = dbMap.get(filename)
            // Use DB data if valid, else derive from filename
            const displayName = dbData?.name || filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
            const grade = dbData?.grade || 'N/A'

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
