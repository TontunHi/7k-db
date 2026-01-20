"use server"

import { getHeroBuilds, saveHeroBuilds } from "@/lib/build-db"
import BuildEditor from "@/components/admin/BuildEditor"

export default async function AdminBuildEditPage({ params }) {
    const { filename } = params
    // Parse name from filename
    // Filename is encoded, e.g. l++_Ace.png
    // Actually params come from route [filename], need to decode
    const decodedFilename = decodeURIComponent(filename)

    // Format Name:
    // We use the full filename as Key in JSON DB to ensure uniqueness
    const builds = await getHeroBuilds(decodedFilename)

    async function handleSave(newBuilds) {
        "use server"
        await saveHeroBuilds(decodedFilename, newBuilds)
    }

    const displayName = decodedFilename.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ")

    return <BuildEditor heroName={displayName} initialBuilds={builds} onSave={handleSave} />
}
