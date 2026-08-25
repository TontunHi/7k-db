import { requireAdmin } from "@/lib/auth-guard"
import { getCommunityBuildSubmissions } from "@/lib/community-build-actions"
import AdminSubmissionsClient from "./AdminSubmissionsClient"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Community Build Submissions | 7K Admin",
    description: "Moderate and approve user-submitted hero builds with author credits.",
}

export const dynamic = "force-dynamic"

export default async function AdminSubmissionsPage() {
    await requireAdmin()
    const submissions = await getCommunityBuildSubmissions("all")

    return <AdminSubmissionsClient initialSubmissions={submissions} />
}
