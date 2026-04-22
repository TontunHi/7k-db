"use client"

import { X } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "../guild-war.module.css"

/**
 * GuildWarItemPicker - Modal for selecting hero equipment
 */
export default function GuildWarItemPicker({ 
    teamId, 
    heroIdx, 
    type, 
    accIdx, 
    items, 
    onSelect, 
    onClose 
}) {
    if (!teamId || heroIdx === undefined || !type) return null

    // Standardize type for image path
    const imageType = type === 'accessories' ? 'accessory' : type

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <div>
                        <h3 className="text-xl font-black text-white capitalize">Tactical {type} Registry</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">SELECT EQUIPMENT FOR DEPLOYMENT</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.modalBody}>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                        {/* Clear Selection Option */}
                        <button 
                            onClick={() => onSelect(teamId, heroIdx, type, type === 'accessories' ? null : '', accIdx)}
                            className="aspect-square rounded-2xl border-2 border-dashed border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 flex flex-col items-center justify-center gap-2 text-[10px] font-black text-gray-500 hover:text-red-500 transition-all uppercase tracking-widest group/none"
                        >
                            <X size={20} className="group-hover/none:scale-110 transition-transform" />
                            <span>Unequip</span>
                        </button>

                        {items.map(item => (
                            <button
                                key={item.filename}
                                onClick={() => onSelect(teamId, heroIdx, type, item.filename, accIdx)}
                                className="group aspect-square rounded-2xl border border-white/5 bg-gradient-to-br from-gray-900 to-black hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all p-3 flex items-center justify-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-500">
                                    <SafeImage src={`/items/${imageType}/${item.filename}`} alt="" fill sizes="100px" className="object-contain" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
