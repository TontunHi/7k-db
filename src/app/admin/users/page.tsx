import UserManagementView from "./components/UserManagementView"
import { getUsers } from "@/lib/user-actions"
import { getAdminUser, requireAdmin } from "@/lib/auth-guard"

export const metadata = {
    title: "User Management | 7K Admin",
    description: "Manage sub-admin accounts and permissions."
}

export default async function UsersPage() {
    // Only super_admin or users with MANAGE_USERS permission can access
    await requireAdmin('MANAGE_USERS')
    
    // Fetch users and current user for the UI
    const users = await getUsers()
    const currentUser = await getAdminUser()

    return (
        <UserManagementView initialUsers={users} currentUser={currentUser} />
    )
}
