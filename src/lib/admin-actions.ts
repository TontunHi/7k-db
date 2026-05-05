"use server"

import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"
import { saveHeroData } from "@/lib/build-db"
import { requireAdmin } from "./auth-guard"

const HEROES_DIR = path.join(process.cwd(), "public", "heroes")
const SKILLS_DIR = path.join(process.cwd(), "public", "skills")

export async function uploadHeroImage(formData: FormData) {
    await requireAdmin()
    const heroFile = formData.get("heroFile") as File
    const skillFiles = formData.getAll("skillFiles") as File[]
    const manualFolderName = formData.get("folderName") as string | null

    if (!heroFile) {
        throw new Error("Missing hero file")
    }

    const originalName = heroFile.name

    // Parse name/grade from filename for DB
    let name = "Unknown"
    let grade = "r"
    const match = originalName.match(/^([a-zA-Z+]+)_(.+)\./)
    if (match) {
        grade = match[1].toLowerCase()
        name = match[2].replace(/_/g, " ")
    } else {
        name = originalName.replace(/\.[^/.]+$/, "").replace(/_/g, " ")
    }

    // 1. Save Hero Image
    if (!fs.existsSync(HEROES_DIR)) {
        fs.mkdirSync(HEROES_DIR, { recursive: true })
    }
    const buffer = Buffer.from(await heroFile.arrayBuffer())
    await fs.promises.writeFile(path.join(HEROES_DIR, originalName), buffer)

    // 2. Save Skills to Hand-picked Folder
    if (skillFiles && skillFiles.length > 0 && skillFiles[0].size > 0 && manualFolderName) {
        // Use the manual folder name provided by user
        const targetDir = path.join(SKILLS_DIR, manualFolderName.trim())

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true })
        }

        for (const sFile of skillFiles) {
            const sBuffer = Buffer.from(await sFile.arrayBuffer())
            // Keep original skill filename (1.png, 2.png)
            await fs.promises.writeFile(path.join(targetDir, sFile.name), sBuffer)
        }
    }

    // 3. Update DB
    await saveHeroData({
        filename: originalName,
        name: name,
        grade: grade,
        skillPriority: []
    })

    revalidatePath("/build")
    revalidatePath("/admin/builds")
}

export async function deleteHeroImage(filename: string) {
    await requireAdmin()
    try {
        const filepath = path.join(HEROES_DIR, filename)
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath)
        }

        // We can't easily auto-delete the skill folder anymore because we don't strictly know which one it was 
        // without looking up the exact logic or trying to match.
        // For now, safe deletion of just the image is better than guessing wrong folder.
        // Or we could try deleting the folder if it matches the filename-derived one provided we used that convention?
        // But user is manually naming folders now.
        // Let's leave skill folder manual cleanup or implicit cleanup if specific structure matches.

        revalidatePath("/build")
        revalidatePath("/admin/builds")
    } catch (error) {
        console.error("Delete error:", error)
        throw new Error("Failed to delete file")
    }
}
