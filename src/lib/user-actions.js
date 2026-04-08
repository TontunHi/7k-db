"use server"

import pool, { initDB } from "./db"
import { revalidatePath } from "next/cache"
import { requireAdmin, getAdminUser } from "./auth-guard"
import bcrypt from "bcryptjs"
import { validateData, UserSchema } from "./validation"

/**
 * List all users (Super Admin only)
 */
export async function getUsers() {
    await requireAdmin('MANAGE_USERS')
    await initDB()
    const [rows] = await pool.query("SELECT id, username, role, permissions, created_at FROM users ORDER BY created_at DESC")
    
    return rows.map(user => {
        if (typeof user.permissions === 'string') {
            try {
                user.permissions = JSON.parse(user.permissions)
            } catch (e) {
                user.permissions = []
            }
        }
        return user
    })
}

/**
 * Create a new user
 */
export async function createUser(userData) {
    await requireAdmin('MANAGE_USERS')
    const validation = validateData(UserSchema, userData)
    if (!validation.success) throw new Error(validation.error)
    
    const { username, password, role, permissions } = validation.data
    if (!password) throw new Error("Password is required for new users")

    const hashedPassword = await bcrypt.hash(password, 10)
    await initDB()
    
    try {
        await pool.query(
            "INSERT INTO users (username, password_hash, role, permissions) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, role || 'admin', JSON.stringify(permissions || [])]
        )
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') throw new Error("Username already exists")
        throw error
    }
}

/**
 * Update a user
 */
export async function updateUser(id, userData) {
    await requireAdmin('MANAGE_USERS')
    const validation = validateData(UserSchema, userData)
    if (!validation.success) throw new Error(validation.error)
    
    const { username, role, permissions, password } = validation.data

    await initDB()
    
    let query = "UPDATE users SET username = ?, role = ?, permissions = ? WHERE id = ?"
    let params = [username, role, JSON.stringify(permissions), id]

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        query = "UPDATE users SET username = ?, role = ?, permissions = ?, password_hash = ? WHERE id = ?"
        params = [username, role, JSON.stringify(permissions), hashedPassword, id]
    }

    await pool.query(query, params)
    revalidatePath("/admin/users")
    return { success: true }
}

/**
 * Delete a user
 */
export async function deleteUser(id) {
    await requireAdmin('MANAGE_USERS')
    const currentUser = await getAdminUser()
    
    if (currentUser.id === id) throw new Error("You cannot delete your own account")

    await initDB()
    await pool.query("DELETE FROM users WHERE id = ?", [id])
    revalidatePath("/admin/users")
    return { success: true }
}
