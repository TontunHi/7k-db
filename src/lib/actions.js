"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(formData) {
    const password = formData.get("password")

    // Debug log
    console.log("Login Attempt:", { passwordInput: password, envPass: process.env.ADMIN_PASSWORD })

    // Simple check against env
    if (password === process.env.ADMIN_PASSWORD) {
        // Set cookie (Async in Next.js 15+)
        const cookieStore = await cookies()
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        })
        redirect("/admin")
    } else {
        // Return error (in real app, use state)
        // For simplicity, we redirect back with query param
        console.log("Password mismatch")
        redirect("/login?error=Invalid Password")
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")
    redirect("/login")
}
