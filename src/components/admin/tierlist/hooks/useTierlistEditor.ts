"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { getTierlistData, saveTierlistEntry, removeTierlistEntry } from "@/lib/tierlist-db"
import { toast } from "sonner"

/**
 * useTierlistEditor - Custom hook for managing tierlist business logic and drag system
 */
export function useTierlistEditor(initialCategory = "PVE") {
    const [category, setCategory] = useState(initialCategory)
    const [tierData, setTierData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Modal State
    const [selectedHero, setSelectedHero] = useState(null)
    const [selectionStep, setSelectionStep] = useState(0)
    const [tempRank, setTempRank] = useState(null)

    const dragRef = useRef(null)
    const categoryRef = useRef(category)
    const fetchRef = useRef(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getTierlistData(category)
            setTierData(data || [])
        } catch (err) {
            console.error("[TIERLIST_FETCH]", err)
            toast.error("Failed to sync tier data")
        } finally {
            setLoading(false)
        }
    }, [category])

    useEffect(() => {
        categoryRef.current = category
        fetchData()
    }, [category, fetchData])

    useEffect(() => {
        fetchRef.current = fetchData
    }, [fetchData])

    // ── Drag & Drop Logic ──────────────────────────────────────────

    const startDrag = useCallback((e, heroFilename, source, imgSrc) => {
        if (e.button !== 0) return
        e.preventDefault()

        dragRef.current = {
            heroFilename,
            source,
            imgSrc,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
            ghost: null,
        }

        function createGhost(x, y) {
            const g = document.createElement("div")
            // Use CSS Module classes via classList if needed, but for precision positioning we keep some inline
            g.style.cssText = `
                position:fixed; width:48px; height:56px; border-radius:8px;
                overflow:hidden; pointer-events:none; z-index:9999;
                opacity:0.9; box-shadow:0 12px 32px rgba(0,0,0,0.8);
                border:2px solid #FFD700;
                left:${x - 24}px; top:${y - 28}px;
                transform:scale(1.2) rotate(3deg);
                transition:transform 0.1s;
                background:#000;
            `
            const img = document.createElement("img")
            img.src = imgSrc
            img.style.cssText = "width:100%;height:100%;object-fit:cover;"
            g.appendChild(img)
            document.body.appendChild(g)
            return g
        }

        function onMouseMove(e) {
            const d = dragRef.current
            if (!d) return

            if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) {
                d.moved = true
                d.ghost = createGhost(e.clientX, e.clientY)
                setIsDragging(true)
            }
            if (d.ghost) {
                d.ghost.style.left = `${e.clientX - 24}px`
                d.ghost.style.top = `${e.clientY - 28}px`
            }
        }

        async function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)

            const d = dragRef.current
            if (!d) return

            if (d.ghost) {
                document.body.removeChild(d.ghost)
                d.ghost = null
            }
            dragRef.current = null
            setIsDragging(false)

            if (!d.moved) return

            // Find drop target
            const el = document.elementFromPoint(e.clientX, e.clientY)
            const cell = el?.closest("[data-rank][data-type]")
            const pool = el?.closest("[data-pool]")

            if (cell) {
                try {
                    const htmlCell = cell as any
                    await saveTierlistEntry({
                        heroFilename: d.heroFilename,
                        category: categoryRef.current,
                        rank: htmlCell.dataset.rank,
                        type: htmlCell.dataset.type,
                    })
                    fetchRef.current?.()
                    toast.success("Position deployed")
                } catch (err) {
                    toast.error("Deployment failed")
                }
            } else if (pool && d.source === "grid") {
                try {
                    await removeTierlistEntry(d.heroFilename, categoryRef.current)
                    fetchRef.current?.()
                    toast.success("Hero returned to reserve")
                } catch (err) {
                    toast.error("Cleanup failed")
                }
            }
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }, [])

    // ── Modal Actions ──────────────────────────────────────────────

    const handleAssign = (heroObj) => {
        if (dragRef.current?.moved) return
        setSelectedHero(heroObj)
        setSelectionStep(1)
        setTempRank(null)
    }

    const handleSave = async (type) => {
        if (!selectedHero || !tempRank) return
        try {
            await saveTierlistEntry({
                heroFilename: selectedHero.filename,
                category,
                rank: tempRank,
                type,
            })
            fetchData()
            setSelectedHero(null)
            setSelectionStep(0)
            toast.success("Assignment saved")
        } catch (err) {
            toast.error("Save failed")
        }
    }

    const handleRemove = async (heroFilename) => {
        try {
            await removeTierlistEntry(heroFilename, category)
            fetchData()
            toast.success("Entry removed")
        } catch (err) {
            toast.error("Removal failed")
        }
    }

    return {
        category,
        setCategory,
        tierData,
        loading,
        isDragging,
        modal: {
            selectedHero,
            setSelectedHero,
            selectionStep,
            setSelectionStep,
            tempRank,
            setTempRank,
        },
        handlers: {
            startDrag,
            handleAssign,
            handleSave,
            handleRemove,
        }
    }
}
