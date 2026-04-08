"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import bcrypt from "bcryptjs"
import pool, { initDB } from "./db"
import { createSignedToken, deleteSession } from "./session"

export async function login(formData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (!username || !password) {
        redirect(`/login?error=Invalid Credentials`)
    }

    await initDB()
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username])

    if (users.length > 0) {
        const user = users[0]
        const isValid = await bcrypt.compare(password, user.password_hash)

        if (isValid) {
            // Sign token with user.id
            const token = await createSignedToken(user.id.toString())

            // Set cookie
            const cookieStore = await cookies()
            cookieStore.set("admin_session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
                sameSite: 'lax'
            })
            redirect("/admin")
        }
    }

    // Return error if user not found or password invalid
    redirect(`/login?error=Invalid Credentials&u=${encodeURIComponent(username)}`)
}

export async function logout() {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    
    if (token) {
        await deleteSession(token)
    }

    cookieStore.delete("admin_session")
    redirect("/login")
}
