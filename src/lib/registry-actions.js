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
    const { id, name, grade, atk_all, def, hp, image } = data
    
    if (id) {
        await pool.query(
            "UPDATE pets SET name = ?, grade = ?, atk_all = ?, def = ?, hp = ?, image = ? WHERE id = ?",
            [name, grade, atk_all, def, hp, image, id]
        )
    } else {
        await pool.query(
            "INSERT INTO pets (name, grade, atk_all, def, hp, image) VALUES (?, ?, ?, ?, ?, ?)",
            [name, grade, atk_all, def, hp, image]
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
    const { id, name, grade, item_type, weapon_group, item_set, atk_all_perc, def_perc, hp_perc, image } = data
    
    if (id) {
        await pool.query(
            "UPDATE items SET name = ?, grade = ?, item_type = ?, weapon_group = ?, item_set = ?, atk_all_perc = ?, def_perc = ?, hp_perc = ?, image = ? WHERE id = ?",
            [name, grade, item_type, weapon_group, item_set, atk_all_perc, def_perc, hp_perc, image, id]
        )
    } else {
        await pool.query(
            "INSERT INTO items (name, grade, item_type, weapon_group, item_set, atk_all_perc, def_perc, hp_perc, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, grade, item_type, weapon_group, item_set, atk_all_perc, def_perc, hp_perc, image]
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

// ─── Asset Utilities ───────────────────────────────────────────

import { readdirSync } from "fs"
import { join } from "path"

export async function getRegistryAssets() {
    const publicDir = join(process.cwd(), "public")
    
    const pets = readdirSync(join(publicDir, "pets")).filter(f => f.endsWith(".webp"))
    const weapons = readdirSync(join(publicDir, "items", "weapon")).filter(f => f.endsWith(".webp"))
    const armors = readdirSync(join(publicDir, "items", "armor")).filter(f => f.endsWith(".webp"))
    const accessories = readdirSync(join(publicDir, "items", "accessory")).filter(f => f.endsWith(".webp"))
    
    return {
        pets,
        items: {
            Weapon: weapons,
            Armor: armors,
            Accessory: accessories
        }
    }
}

export async function getFullRegistryData() {
    const [heroes, pets, items, assets] = await Promise.all([
        getHeroesRegistry(),
        getPetsRegistry(),
        getItemsRegistry(),
        getRegistryAssets()
    ])
    return { heroes, pets, items, assets }
}
