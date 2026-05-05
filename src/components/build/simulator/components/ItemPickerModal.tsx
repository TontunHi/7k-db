'use client'
import { X } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import styles from './ItemPickerModal.module.css'

export default function ItemPickerModal({ type, items, onSelect, onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2 className={styles.title}>Select {type}</h2>
                        <p className={styles.subtitle}>Equipment Library</p>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X />
                    </button>
                </div>
                
                <div className={styles.content}>
                    {(items || []).map((img, idx) => {
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
                    })}
                    {(!items || items.length === 0) && (
                        <div className={styles.emptyState}>No items found</div>
                    )}
                </div>
            </div>
        </div>
    )
}
