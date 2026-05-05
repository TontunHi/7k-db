"use client"

import { useUserManagement } from "../hooks/useUserManagement"
import UserCard from "./UserCard"
import UserModal from "./UserModal"
import styles from "../users.module.css"
import { clsx } from "clsx"
import { ActionLabel, Marker } from "@/app/admin/components/AdminEditorial"

const PERMISSION_GROUPS = [
    {
        name: 'Content Management',
        permissions: [
            { id: 'MANAGE_BUILDS', label: 'Hero Builds', color: 'text-blue-400 bg-blue-400/10' },
            { id: 'MANAGE_TIERLIST', label: 'Tier List', color: 'text-pink-400 bg-pink-400/10' },
        ]
    },
    {
        name: 'Game Modes',
        permissions: [
            { id: 'MANAGE_STAGES', label: 'Stages', color: 'text-amber-400 bg-amber-400/10' },
            { id: 'MANAGE_DUNGEONS', label: 'Dungeons', color: 'text-emerald-400 bg-emerald-400/10' },
            { id: 'MANAGE_RAIDS', label: 'Raids', color: 'text-red-400 bg-red-400/10' },
            { id: 'MANAGE_CASTLE_RUSH', label: 'Castle Rush', color: 'text-yellow-400 bg-yellow-400/10' },
            { id: 'MANAGE_ADVENT', label: 'Advent', color: 'text-violet-400 bg-violet-400/10' },
            { id: 'MANAGE_ARENA', label: 'Arena', color: 'text-orange-400 bg-orange-400/10' },
            { id: 'MANAGE_TOTAL_WAR', label: 'Total War', color: 'text-rose-400 bg-rose-400/10' },
            { id: 'MANAGE_GUILD_WAR', label: 'Guild War', color: 'text-indigo-400 bg-indigo-400/10' },
        ]
    },
    {
        name: 'System & Misc',
        permissions: [
            { id: 'MANAGE_MESSAGES', label: 'Messages', color: 'text-cyan-400 bg-cyan-400/10' },
            { id: 'MANAGE_ASSETS', label: 'Assets', color: 'text-gray-400 bg-gray-400/10' },
            { id: 'MANAGE_CREDITS', label: 'Credits', color: 'text-rose-300 bg-rose-300/10' },
        ]
    }
]

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap(g => g.permissions)

export default function UserManagementView({ initialUsers, currentUser }) {
    const {
        filteredUsers,
        searchQuery,
        setSearchQuery,
        roleFilter,
        setRoleFilter,
        isModalOpen,
        setIsModalOpen,
        editingUser,
        formData,
        loading,
        openCreateModal,
        openEditModal,
        handlePermissionToggle,
        handleSelectAllPermissions,
        handleClearAllPermissions,
        handleSubmit,
        handleDelete,
        updateFormField
    } = useUserManagement(initialUsers)

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.headerCard}>
                <div className={styles.glowOverlay} />
                <div className={styles.headerTitleGroup}>
                    <div className={styles.titleRow}>
                        <Marker color="bg-primary" className="w-2 h-10" />
                        <h1 className={styles.title}>
                            TEAM <span className={styles.titleGradient}>ACCESS</span>
                        </h1>
                    </div>
                    <p className={styles.subtitle}>Administrative privileges and account controls</p>
                </div>
                <button onClick={openCreateModal} className={styles.createButton}>
                    <ActionLabel label="CREATE_NEW_ADMIN" color="text-black" />
                </button>
            </header>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <input 
                        type="text" 
                        placeholder="SEARCH_BY_USERNAME..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <nav className={styles.filterGroup}>
                    {['ALL', 'SUPER_ADMIN', 'ADMIN'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={clsx(
                                styles.filterButton,
                                roleFilter === role && (role === 'SUPER_ADMIN' ? styles.activeSuperFilter : styles.activeFilter)
                            )}
                        >
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Grid */}
            <div className={styles.userGrid}>
                {filteredUsers.length === 0 ? (
                    <div className={clsx(styles.userCard, "col-span-full py-20 flex flex-col items-center justify-center")}>
                        <div className="text-[4rem] font-black opacity-5 italic mb-4">NO_PERSONNEL</div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Try adjusting your search query or filters above.</p>
                    </div>
                ) : filteredUsers.map(user => (
                    <UserCard 
                        key={user.id}
                        user={user}
                        currentUser={currentUser}
                        allPermissions={ALL_PERMISSIONS}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Modal */}
            <UserModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingUser={editingUser}
                formData={formData}
                loading={loading}
                permissionGroups={PERMISSION_GROUPS}
                allPermissions={ALL_PERMISSIONS}
                onPermissionToggle={handlePermissionToggle}
                onSelectAll={handleSelectAllPermissions}
                onClearAll={handleClearAllPermissions}
                onUpdateField={updateFormField}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
