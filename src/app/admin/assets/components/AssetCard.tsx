"use client"

import NextImage from 'next/image'
import { Trash2 } from 'lucide-react'
import styles from '../assets.module.css'
import { clsx } from 'clsx'

export default function AssetCard({ src, filename, onDelete, variant = 'portrait' }) {
    return (
        <div className={clsx(styles.assetCard, variant === 'square' && styles.squareCard)}>
            <div className={styles.imageWrapper}>
                <NextImage 
                    src={src} 
                    alt={filename} 
                    fill 
                    className={variant === 'square' ? "object-contain" : "object-cover"} 
                />
                <div className={styles.overlay}>
                    <button 
                        onClick={() => onDelete(filename)} 
                        className={styles.deleteButton}
                        title="Delete Asset"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className={styles.filename}>
                {filename.split('/').pop()}
            </div>
        </div>
    )
}
