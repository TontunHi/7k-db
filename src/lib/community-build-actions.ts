'use server'

import pool, { initDB } from '@/lib/db'
import { requireAdmin } from './auth-guard'
import { validateData, CommunityBuildSubmissionSchema } from './validation'
import { logSiteUpdate } from './log-actions'
import { revalidatePath } from 'next/cache'
import { type RowDataPacket, type ResultSetHeader } from 'mysql2'

export interface CommunityBuildSubmission {
    id: number
    hero_filename: string
    author_name: string
    author_contact: string | null
    c_level: string | null
    modes: string[]
    weapons: Array<{ image?: string | null; stat?: string | null }>
    armors: Array<{ image?: string | null; stat?: string | null }>
    accessories: Array<{ image?: string | null; refined?: string | null }>
    substats: string[]
    min_stats: Record<string, any>
    note: string | null
    status: 'pending' | 'approved' | 'rejected'
    admin_note: string | null
    created_at: string
    updated_at: string
}

export async function submitCommunityBuild(rawData: any) {
    await initDB()

    const validation = validateData(CommunityBuildSubmissionSchema, rawData)
    if (!validation.success) {
        return { success: false, error: validation.error }
    }
    const data = validation.data
    const slug = data.hero_filename.replace(/\.[^/.]+$/, "")

    try {
        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO community_build_submissions 
            (hero_filename, author_name, author_contact, c_level, modes, weapons, armors, accessories, substats, min_stats, dedicated_stats, note, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                slug,
                data.author_name,
                data.author_contact || null,
                data.c_level || 'C0',
                JSON.stringify(data.modes || ['General']),
                JSON.stringify(data.weapons || []),
                JSON.stringify(data.armors || []),
                JSON.stringify(data.accessories || []),
                JSON.stringify(data.substats || []),
                JSON.stringify(data.min_stats || {}),
                JSON.stringify(data.dedicated_stats || [null, null, null, null, null, null, null, null]),
                data.note || null
            ]
        )

        return { 
            success: true, 
            message: 'Your build submission has been sent to the moderation queue! Thank you for contributing.',
            id: result.insertId 
        }
    } catch (err: any) {
        console.error('Error submitting community build:', err)
        return { success: false, error: err.message || 'Failed to submit build' }
    }
}

export async function getCommunityBuildSubmissions(status: 'all' | 'pending' | 'approved' | 'rejected' = 'all') {
    await requireAdmin()
    await initDB()

    const query = status === 'all'
        ? `SELECT s.*, h.name as hero_name, h.grade as hero_grade 
           FROM community_build_submissions s 
           LEFT JOIN heroes h ON s.hero_filename = h.filename OR s.hero_filename = h.slug
           ORDER BY s.created_at DESC`
        : `SELECT s.*, h.name as hero_name, h.grade as hero_grade 
           FROM community_build_submissions s 
           LEFT JOIN heroes h ON s.hero_filename = h.filename OR s.hero_filename = h.slug
           WHERE s.status = ?
           ORDER BY s.created_at DESC`

    const params = status === 'all' ? [] : [status]
    const [rows] = await pool.query<RowDataPacket[]>(query, params)

    return rows.map(r => ({
        id: r.id,
        hero_filename: r.hero_filename,
        hero_name: r.hero_name || r.hero_filename,
        hero_grade: r.hero_grade || 'L+',
        author_name: r.author_name,
        author_contact: r.author_contact,
        c_level: r.c_level,
        modes: typeof r.modes === 'string' ? JSON.parse(r.modes) : (r.modes || []),
        weapons: typeof r.weapons === 'string' ? JSON.parse(r.weapons) : (r.weapons || []),
        armors: typeof r.armors === 'string' ? JSON.parse(r.armors) : (r.armors || []),
        accessories: typeof r.accessories === 'string' ? JSON.parse(r.accessories) : (r.accessories || []),
        substats: typeof r.substats === 'string' ? JSON.parse(r.substats) : (r.substats || []),
        min_stats: typeof r.min_stats === 'string' ? JSON.parse(r.min_stats) : (r.min_stats || {}),
        dedicated_stats: typeof r.dedicated_stats === 'string' ? JSON.parse(r.dedicated_stats) : (r.dedicated_stats || [null, null, null, null, null, null, null, null]),
        note: r.note,
        status: r.status,
        admin_note: r.admin_note,
        created_at: r.created_at,
        updated_at: r.updated_at
    }))
}

export async function getPendingSubmissionsCount(): Promise<number> {
    try {
        await initDB()
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as cnt FROM community_build_submissions WHERE status = 'pending'`
        )
        return rows[0]?.cnt || 0
    } catch {
        return 0
    }
}

export async function approveCommunityBuild(submissionId: number) {
    await requireAdmin()
    await initDB()

    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        // 1. Get submission
        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT * FROM community_build_submissions WHERE id = ?`,
            [submissionId]
        )
        const sub = rows[0]
        if (!sub) {
            throw new Error('Submission not found')
        }

        // 2. Determine next build_index for this hero
        const [indexRows] = await connection.query<RowDataPacket[]>(
            `SELECT COALESCE(MAX(build_index), 0) + 1 as next_idx FROM builds WHERE hero_filename = ?`,
            [sub.hero_filename]
        )
        const nextIndex = indexRows[0]?.next_idx || 1

        // 3. Insert into active builds
        await connection.query(
            `INSERT INTO builds (hero_filename, c_level, modes, note, weapons, armors, accessories, substats, min_stats, dedicated_stats, build_index, author_name, author_contact)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                sub.hero_filename,
                sub.c_level || 'C0',
                typeof sub.modes === 'string' ? sub.modes : JSON.stringify(sub.modes || ['Community Build']),
                sub.note || null,
                typeof sub.weapons === 'string' ? sub.weapons : JSON.stringify(sub.weapons || []),
                typeof sub.armors === 'string' ? sub.armors : JSON.stringify(sub.armors || []),
                typeof sub.accessories === 'string' ? sub.accessories : JSON.stringify(sub.accessories || []),
                typeof sub.substats === 'string' ? sub.substats : JSON.stringify(sub.substats || []),
                typeof sub.min_stats === 'string' ? sub.min_stats : JSON.stringify(sub.min_stats || {}),
                typeof sub.dedicated_stats === 'string' ? sub.dedicated_stats : JSON.stringify(sub.dedicated_stats || [null, null, null, null, null, null, null, null]),
                nextIndex,
                sub.author_name,
                sub.author_contact || null
            ]
        )

        // 4. Mark submission as approved
        await connection.query(
            `UPDATE community_build_submissions SET status = 'approved', updated_at = NOW() WHERE id = ?`,
            [submissionId]
        )

        await connection.commit()

        // 5. Log update
        try {
            await logSiteUpdate('HERO', sub.hero_filename, 'CREATE', `Approved community build by ${sub.author_name} for ${sub.hero_filename}`)
        } catch {}

        revalidatePath('/build')
        revalidatePath('/admin/submissions')
        revalidatePath('/admin/builds')

        return { success: true }
    } catch (err: any) {
        await connection.rollback()
        console.error('Error approving submission:', err)
        return { success: false, error: err.message }
    } finally {
        connection.release()
    }
}

export async function rejectCommunityBuild(submissionId: number, adminNote?: string) {
    await requireAdmin()
    await initDB()

    try {
        await pool.query(
            `UPDATE community_build_submissions SET status = 'rejected', admin_note = ?, updated_at = NOW() WHERE id = ?`,
            [adminNote || null, submissionId]
        )

        revalidatePath('/admin/submissions')
        return { success: true }
    } catch (err: any) {
        console.error('Error rejecting submission:', err)
        return { success: false, error: err.message }
    }
}

export async function deleteCommunityBuildSubmission(submissionId: number) {
    await requireAdmin()
    await initDB()

    try {
        await pool.query(`DELETE FROM community_build_submissions WHERE id = ?`, [submissionId])
        revalidatePath('/admin/submissions')
        return { success: true }
    } catch (err: any) {
        console.error('Error deleting submission:', err)
        return { success: false, error: err.message }
    }
}

export async function getBuildSubmissionFormAssets() {
    await initDB()
    const { getHeroBuildList } = await import('./hero-actions')
    const { getItemImages } = await import('./build-db')

    // 1. Get heroes list
    const heroes = await getHeroBuildList()

    // 2. Query items from DB with weapon_group
    let dbWeapons: Array<{ image: string; name: string; weapon_group: string }> = []
    let dbArmors: Array<string> = []
    let dbAccessories: Array<string> = []

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT name, image, item_type, COALESCE(weapon_group, 'Physical') as weapon_group 
             FROM items 
             ORDER BY FIELD(grade, 'a', 'l++', 'l+', 'l', 'r', 'uc', 'c'), name ASC`
        )

        if (rows.length > 0) {
            dbWeapons = rows
                .filter(r => r.item_type === 'Weapon')
                .map(r => {
                    const lower = (r.image || '').toLowerCase()
                    const isMagicFile = lower.includes('orb') || lower.includes('staff') || lower.includes('scripture')
                    const rawGroup = r.weapon_group || (isMagicFile ? 'Magic' : 'Physical')
                    return {
                        image: r.image,
                        name: r.name,
                        weapon_group: rawGroup
                    }
                })

            dbArmors = rows
                .filter(r => r.item_type === 'Armor')
                .map(r => r.image)

            dbAccessories = rows
                .filter(r => r.item_type === 'Accessory')
                .map(r => r.image)
        }
    } catch (e) {
        console.error('Error fetching items from DB:', e)
    }

    // Fallback to directory images if DB items empty
    if (dbWeapons.length === 0) {
        const fallbackWeaponImgs = await getItemImages('weapon')
        dbWeapons = fallbackWeaponImgs.map(img => {
            const lower = img.toLowerCase()
            const isMagic = lower.includes('orb') || lower.includes('staff') || lower.includes('scripture') || lower.includes('magic')
            return {
                image: img,
                name: img.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
                weapon_group: isMagic ? 'Magic' : 'Physical'
            }
        })
    }

    if (dbArmors.length === 0) {
        dbArmors = await getItemImages('armor')
    }

    if (dbAccessories.length === 0) {
        dbAccessories = await getItemImages('accessory')
    }

    return {
        heroes,
        weapons: dbWeapons,
        armors: dbArmors,
        accessories: dbAccessories
    }
}
