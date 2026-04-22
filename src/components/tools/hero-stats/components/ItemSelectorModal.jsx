'use client'
import { X } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import styles from './ItemSelectorModal.module.css'

export default function ItemSelectorModal({ slotKey, items, onSelect, onClose }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        {slotKey.replace(/([A-Z])(\d)/, '$1')} Gallery
                    </h3>
                    <button onClick={onClose} className={styles.btnClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className={styles.content}>
                    {items.map(w => (
                        <button 
                            key={w.id}
                            onClick={() => onSelect(w)}
                            className={styles.itemButton}
                        >
                            <div className={styles.itemPortrait}>
                                <SafeImage src={w.image} fill className="object-cover" alt="" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
