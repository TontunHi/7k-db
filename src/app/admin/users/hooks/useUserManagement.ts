"use client"

import { useState, useMemo } from "react"
import { createUser, updateUser, deleteUser } from "@/lib/user-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

/**
 * useUserManagement - Custom hook to manage administrative user accounts and permissions.
 */
export function useUserManagement(initialUsers) {
    const router = useRouter()
    
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
        permissions: []
    })

    const filteredUsers = useMemo(() => {
        return initialUsers.filter(u => {
            const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter
            return matchesSearch && matchesRole
        })
    }, [initialUsers, searchQuery, roleFilter])

    const openCreateModal = () => {
        setEditingUser(null)
        setFormData({ username: '', password: '', role: 'admin', permissions: [] })
        setIsModalOpen(true)
    }

    const openEditModal = (user) => {
        setEditingUser(user)
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
            permissions: user.permissions || []
        })
        setIsModalOpen(true)
    }

    const handlePermissionToggle = (permId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }))
    }
    
    const handleSelectAllPermissions = (allIds) => {
        setFormData(prev => ({ ...prev, permissions: allIds }))
    }
    
    const handleClearAllPermissions = () => {
        setFormData(prev => ({ ...prev, permissions: [] }))
    }

    const updateFormField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault()
        setLoading(true)
        
        const actionPromise = editingUser
            ? updateUser(editingUser.id, { ...formData, role: formData.role as "admin" | "super_admin" })
            : createUser({ ...formData, role: formData.role as "admin" | "super_admin" })
            
        toast.promise(actionPromise, {
            loading: editingUser ? 'Updating user...' : 'Creating user...',
            success: () => {
                setLoading(false)
                setIsModalOpen(false)
                router.refresh()
                return `User ${editingUser ? 'updated' : 'created'} successfully!`
            },
            error: (err) => {
                setLoading(false)
                return err.message || 'Operation failed'
            }
        })
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
        
        toast.promise(deleteUser(id), {
            loading: 'Deleting user...',
            success: () => {
                router.refresh()
                return 'User deleted successfully!'
            },
            error: (err) => err.message || 'Deleted failed'
        })
    }

    return {
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
    }
}
