"use client"

import { useState } from "react"
import { X, Search } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "../guild-war.module.css"

/**
 * GuildWarItemPicker - Modal for selecting hero equipment, with search filter
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
    const [query, setQuery] = useState('')

    if (!teamId || heroIdx === undefined || !type) return null

    const imageType = type === 'accessories' ? 'accessory' : type

    const filteredItems = query.trim()
        ? items.filter(item =>
            (item.filename || item).toLowerCase().includes(query.toLowerCase())
          )
        : items

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <div>
                        <h3 className="text-lg font-black text-foreground capitalize">
                            {type} Registry
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mt-0.5">
                            {items.length} items available
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className={styles.pickerSearch}>
                            <Search size={13} className={styles.pickerSearchIcon} />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Filter items…"
                                className={styles.pickerSearchInput}
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="text-white/20 hover:text-white/60 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors text-white/40"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className={styles.modalBody}>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                        {/* Unequip */}
                        {!query && (
                            <button
                                onClick={() => onSelect(teamId, heroIdx, type, type === 'accessories' ? null : '', accIdx)}
                                className="aspect-square rounded-xl border-2 border-dashed border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 flex flex-col items-center justify-center gap-1 text-[9px] font-black text-gray-500 hover:text-red-400 transition-all uppercase tracking-widest"
                            >
                                <X size={16} />
                                <span>None</span>
                            </button>
                        )}

                        {filteredItems.length === 0 && (
                            <div className="col-span-full py-8 text-center text-white/20 text-sm font-bold italic">
                                No items match "{query}"
                            </div>
                        )}

                        {filteredItems.map(item => (
                            <button
                                key={item.filename}
                                onClick={() => onSelect(teamId, heroIdx, type, item.filename, accIdx)}
                                className="group aspect-square rounded-xl border border-border bg-muted hover:border-amber-500/50 hover:shadow-[0_0_16px_rgba(245,158,11,0.15)] transition-all p-2 flex items-center justify-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-300">
                                    <SafeImage
                                        src={`/items/${imageType}/${item.filename}`}
                                        alt=""
                                        fill
                                        sizes="80px"
                                        className="object-contain"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
