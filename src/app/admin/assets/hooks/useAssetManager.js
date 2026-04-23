"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllHeroes, getPets, getAllSkills } from "@/lib/stage-actions"

/**
 * useAssetManager - Custom hook to manage asset synchronization and file operations.
 * Maintains original process using /api/assets and stage-actions.
 */
export function useAssetManager() {
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState('heroes')
    const [search, setSearch] = useState('')
    const [skillFolder, setSkillFolder] = useState('')

    const loadData = async () => {
        setLoading(true)
        try {
            const [h, p, s] = await Promise.all([getAllHeroes(), getPets(), getAllSkills()])
            setHeroes(h)
            setPets(p)
            setSkills(s)
        } catch (error) {
            toast.error('Failed to load assets: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        if (activeTab === 'skills' && !skillFolder) {
            toast.error('Please select a hero folder or create one first!')
            return
        }

        setUploading(true)
        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('type', activeTab)
                formData.append('file', file)
                if (activeTab === 'skills') {
                    formData.append('subfolder', skillFolder)
                }
                
                const res = await fetch('/api/assets', {
                    method: 'POST',
                    body: formData
                })
                
                const data = await res.json()
                if (!res.ok) throw new Error(data.error)
            }
            toast.success(`Uploaded ${files.length} file(s) successfully!`)
            loadData()
        } catch (error) {
            toast.error('Upload Failed: ' + error.message)
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleDelete = async (filename, folder = '') => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return
        
        try {
            const cleanFilename = filename.startsWith('/') ? filename.split('/').pop() : filename
            
            let url = `/api/assets?type=${activeTab}&filename=${encodeURIComponent(cleanFilename)}`
            if (activeTab === 'skills') {
                url += `&subfolder=${folder || skillFolder}`
            }

            const res = await fetch(url, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            
            toast.success(`Deleted ${cleanFilename}`)
            loadData()
        } catch (error) {
            toast.error('Delete Failed: ' + error.message)
        }
    }

    return {
        heroes,
        pets,
        skills,
        loading,
        uploading,
        activeTab,
        setActiveTab,
        search,
        setSearch,
        skillFolder,
        setSkillFolder,
        handleUpload,
        handleDelete,
        refresh: loadData
    }
}
