"use client"

import Link from "next/link"
import { Trash2, ChevronRight } from "lucide-react"
import { deleteStage } from "@/lib/stage-actions"
import { toast } from "sonner"
import { clsx } from "clsx"
import styles from "../stages.module.css"

/**
 * StageCard - Displays a summary of a stage setup
 */
export default function StageCard({ stage, isNightmare }) {
    
    async function handleDelete(e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (!window.confirm(`Are you sure you want to delete "${stage.name}"?`)) return
        
        try {
            const result = await deleteStage(stage.id)
            if (result.success) {
                toast.success("Stage setup deleted")
            } else {
                toast.error(result.error || "Failed to delete stage")
            }
        } catch (err) {
            toast.error("A system error occurred during deletion")
        }
    }

    return (
        <div className={clsx(styles.card, isNightmare && styles.cardNightmare)}>
            <Link href={`/admin/stages/${stage.id}`} className="absolute inset-0 z-10" />
            
            <div className={styles.cardHeader}>
                <div className="space-y-1 overflow-hidden">
                    <h3 className={styles.cardTitle}>{stage.name}</h3>
                    <p className={styles.cardDate}>
                        {new Date(stage.created_at).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                    </p>
                </div>
                
                <button 
                    onClick={handleDelete}
                    className={styles.deleteBtn}
                    aria-label="Delete stage"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className={styles.cardBody}>
                <p className={styles.cardNote}>
                    {stage.note || "No strategy notes provided for this setup."}
                </p>
            </div>

            <div className={styles.cardFooter}>
                <ChevronRight size={20} className={styles.arrowIcon} />
            </div>
        </div>
    )
}
