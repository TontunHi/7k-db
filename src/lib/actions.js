"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createSignedToken, generateSessionId, deleteSession } from "./session"

export async function login(formData) {
    const password = formData.get("password")

    // Simple check against env
    if (password === process.env.ADMIN_PASSWORD) {
        // Generate secure signed session token
        const sessionId = generateSessionId()
        const token = await createSignedToken(sessionId)

        // Set cookie (Async in Next.js 15+)
        const cookieStore = await cookies()
        cookieStore.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
            sameSite: 'lax'
        })
        redirect("/admin")
    } else {
        // Return error
        redirect("/login?error=Invalid Password")
    }
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
