'use server'

import pool, { initDB } from "./db"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "./auth-guard"
import { isContactFormEnabled } from "./setting-actions"
import { headers } from "next/headers"

/**
 * Send a message from a public user
 * Includes: Honeypot check, Rate Limiting (IP-based)
 */
export async function sendMessage(formData) {
    try {
        await initDB()
        
        // --- 0. Check if messaging is enabled ---
        if (!(await isContactFormEnabled())) {
            throw new Error("Messaging is currently disabled. Please reach out via email.")
        }

        const name = formData.get("name")
        const email = formData.get("email")
        const subject = formData.get("subject") || ""
        const message = formData.get("message")
        
        // --- 1. Honeypot check ---
        const honeypot = formData.get("nickname") // This field should be hidden from users
        if (honeypot) {
            console.warn("Honeypot triggered, likely a bot.")
            return { success: true } // Silently fail to the bot
        }
        
        // --- 2. Basic Validation ---
        if (!name || !email || !message) {
            throw new Error("Missing required fields")
        }
        
        // --- 3. Get IP Address ---
        const headerList = await headers()
        const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
        
        // --- 4. Rate Limiting ---
        // Check how many messages from this IP in the last 10 minutes
        const [rateLimitRows] = await pool.query(
            "SELECT COUNT(*) as count FROM contact_messages WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)",
            [ip]
        )
        
        if (rateLimitRows[0].count >= 3) {
            throw new Error("Too many messages. Please try again later (Rate limit: 3 per 10 mins).")
        }
        
        // --- 5. Save Message ---
        await pool.query(
            "INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)",
            [name, email, subject, message, ip]
        )
        
        revalidatePath("/admin/messages")
        
        return { success: true }
    } catch (error) {
        console.error("Error sending message:", error)
        return { success: false, error: error.message }
    }
}

/**
 * Get all messages for admin
 */
export async function getMessages() {
    try {
        await requireAdmin()
        await initDB()
        const [rows] = await pool.query(
            "SELECT * FROM contact_messages ORDER BY created_at DESC"
        )
        return rows
    } catch (error) {
        console.error("Error getting messages:", error)
        return []
    }
}

/**
 * Update message status
 */
export async function updateMessageStatus(id, status) {
    try {
        await requireAdmin()
        await initDB()
        await pool.query(
            "UPDATE contact_messages SET status = ? WHERE id = ?",
            [status, id]
        )
        revalidatePath("/admin/messages")
        return { success: true }
    } catch (error) {
        console.error("Error updating message status:", error)
        return { success: false, error: error.message }
    }
}

/**
 * Delete a message
 */
export async function deleteMessage(id) {
    try {
        await requireAdmin()
        await initDB()
        await pool.query(
            "DELETE FROM contact_messages WHERE id = ?",
            [id]
        )
        revalidatePath("/admin/messages")
        return { success: true }
    } catch (error) {
        console.error("Error deleting message:", error)
        return { success: false, error: error.message }
    }
}
