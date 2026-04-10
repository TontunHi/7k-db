"use server"

import pool, { initDB } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function ensureDB() {
    await initDB()
}

// ─── Heroes Registry ───────────────────────────────────────────

export async function getHeroesRegistry() {
    await ensureDB()
    const [rows] = await pool.query(`
        SELECT * FROM heroes 
        ORDER BY 
            FIELD(grade, 'l++', 'l+', 'l', 'r', 'uc', 'c'),
            name ASC
    `)
    return rows
}

export async function updateHeroRegistry(filename, data) {
    await ensureDB()
    const fields = [
        "type", "hero_group", "atk_phys", "atk_mag", "def", "hp", 
        "speed", "crit_rate", "crit_dmg", "weak_hit", "block_rate", 
        "dmg_red", "eff_hit", "eff_res"
    ]
    
    const updates = []
    const values = []
    
    fields.forEach(field => {
        if (data[field] !== undefined) {
            updates.push(`${field} = ?`)
            values.push(data[field])
        }
    })
    
    if (updates.length === 0) return { success: true }
    
    values.push(filename)
    await pool.query(`UPDATE heroes SET ${updates.join(", ")} WHERE filename = ?`, values)
    revalidatePath("/admin/registry")
    return { success: true }
}

// ─── Pets Registry ─────────────────────────────────────────────

export async function getPetsRegistry() {
    await ensureDB()
    const [rows] = await pool.query(`
        SELECT * FROM pets 
        ORDER BY 
            FIELD(grade, 'l++', 'l+', 'l', 'r', 'uc', 'c'),
            name ASC
    `)
    return rows
}

export async function upsertPetRegistry(data) {
    await ensureDB()
    const { id, name, grade, atk_all, def, hp } = data
    
    if (id) {
        await pool.query(
            "UPDATE pets SET name = ?, grade = ?, atk_all = ?, def = ?, hp = ? WHERE id = ?",
            [name, grade, atk_all, def, hp, id]
        )
    } else {
        await pool.query(
            "INSERT INTO pets (name, grade, atk_all, def, hp) VALUES (?, ?, ?, ?, ?)",
            [name, grade, atk_all, def, hp]
        )
    }
    
    revalidatePath("/admin/registry")
    return { success: true }
}

export async function deletePetRegistry(id) {
    await ensureDB()
    await pool.query("DELETE FROM pets WHERE id = ?", [id])
    revalidatePath("/admin/registry")
    return { success: true }
}

// ─── Items Registry ────────────────────────────────────────────

export async function getItemsRegistry() {
    await ensureDB()
    const [rows] = await pool.query(`
        SELECT * FROM items 
        ORDER BY 
            item_type, 
            FIELD(grade, 'l++', 'l+', 'l', 'r', 'uc', 'c'),
            name ASC
    `)
    return rows
}

export async function upsertItemRegistry(data) {
    await ensureDB()
    const { id, name, grade, item_type, atk_all_perc, def_perc, hp_perc } = data
    
    if (id) {
        await pool.query(
            "UPDATE items SET name = ?, grade = ?, item_type = ?, atk_all_perc = ?, def_perc = ?, hp_perc = ? WHERE id = ?",
            [name, grade, item_type, atk_all_perc, def_perc, hp_perc, id]
        )
    } else {
        await pool.query(
            "INSERT INTO items (name, grade, item_type, atk_all_perc, def_perc, hp_perc) VALUES (?, ?, ?, ?, ?, ?)",
            [name, grade, item_type, atk_all_perc, def_perc, hp_perc]
        )
    }
    
    revalidatePath("/admin/registry")
    return { success: true }
}

export async function deleteItemRegistry(id) {
    await ensureDB()
    await pool.query("DELETE FROM items WHERE id = ?", [id])
    revalidatePath("/admin/registry")
    return { success: true }
}

export async function getFullRegistryData() {
    const [heroes, pets, items] = await Promise.all([
        getHeroesRegistry(),
        getPetsRegistry(),
        getItemsRegistry()
    ])
    return { heroes, pets, items }
}
