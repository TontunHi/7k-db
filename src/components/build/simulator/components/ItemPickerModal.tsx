'use client'
import { X } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import { getDedicatedStatIcon } from '../constants'
import styles from './ItemPickerModal.module.css'

export default function ItemPickerModal({ type, items, onSelect, onClose }) {
    const isDedicated = type === 'dedicated'

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>Select {isDedicated ? 'Dedicated Stat' : type}</h2>
                        <p className={styles.subtitle}>{isDedicated ? 'Stat Selection' : 'Equipment Library'}</p>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X />
                    </button>
                </div>
                
                <div className={isDedicated ? "p-8 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4" : styles.content}>
                    {isDedicated ? (
                        (items || []).map((statName, idx) => {
                            const icon = getDedicatedStatIcon(statName)
                            return (
                                <button
                                    key={idx}
                                    onClick={() => onSelect(statName)}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-primary/50 hover:bg-[#FFD700]/5 transition-all text-left group"
                                >
                                    {icon && (
                                        <div className="w-10 h-10 relative flex-shrink-0 bg-black/20 rounded-xl p-1.5 border border-white/5 group-hover:border-primary/30">
                                            <SafeImage src={icon} fill className="object-contain" alt="" />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-gray-300 group-hover:text-primary transition-colors">{statName}</span>
                                </button>
                            )
                        })
                    ) : (
                        (items || []).map((img, idx) => {
                            const imgFolder = type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'accessory'
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => onSelect(img)}
                                    className={styles.itemWrapper}
                                >
                                    <div className={styles.itemBox}>
                                        <SafeImage src={`/items/${imgFolder}/${img}`} fill className={styles.itemImage} alt="" />
                                        <div className={styles.itemHoverOverlay} />
                                    </div>
                                    <div className={styles.itemGlow} />
                                </div>
                            )
                        })
                    )}
                    {(!items || items.length === 0) && (
                        <div className={styles.emptyState}>No items found</div>
                    )}
                </div>
            </div>
        </div>
    )
}

