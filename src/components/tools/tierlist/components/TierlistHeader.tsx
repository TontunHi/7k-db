'use client'
import { Copy, Download, RotateCcw, Rows, Grid2X2 } from 'lucide-react'
import { clsx } from 'clsx'
import { LAYOUT_MODES } from '../constants'
import styles from './TierlistHeader.module.css'

export default function TierlistHeader({ 
    title, setTitle, layoutMode, onToggleLayout, 
    onReset, onExport 
}) {
    return (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.titleInput}
                    placeholder="Archive Identity..."
                />
                
                <div className={styles.divider}></div>
                
                <div className={styles.desktopControls}>
                    <button 
                        onClick={onToggleLayout}
                        className={clsx(
                            styles.btnLayout,
                            layoutMode === LAYOUT_MODES.MATRIX ? styles.btnLayoutActive : styles.btnLayoutInactive
                        )}
                    >
                        {layoutMode === LAYOUT_MODES.MATRIX ? <Grid2X2 size={14} /> : <Rows size={14} />}
                        <span className={styles.labelHidden}>
                            {layoutMode === LAYOUT_MODES.MATRIX ? "Rank / Table View" : "Rank Table"}
                        </span>
                    </button>
                </div>
            </div>

            <div className={styles.headerRight}>
                {/* Mobile-only layout toggle */}
                <button 
                    onClick={onToggleLayout}
                    className={clsx(
                        styles.btnLayout,
                        styles.mobileOnly,
                        layoutMode === LAYOUT_MODES.MATRIX ? styles.btnLayoutActive : styles.btnLayoutInactive
                    )}
                >
                    {layoutMode === LAYOUT_MODES.MATRIX ? <Grid2X2 size={14} /> : <Rows size={14} />}
                </button>

                <button 
                    onClick={onReset}
                    className={styles.btnReset}
                    title="Reset Archive"
                >
                    <RotateCcw size={18} />
                </button>
                
                <div className={clsx(styles.divider, styles.desktopControls)}></div>
                
                <button 
                    onClick={() => onExport('copy')}
                    className={styles.btnCopy}
                >
                    <Copy size={16} className="text-[#FFD700]" /> 
                    <span className={styles.labelHidden}>Copy</span>
                </button>
                
                <button 
                    onClick={() => onExport('download')}
                    className={styles.btnExport}
                >
                    <Download size={16} /> 
                    <span className={styles.labelHidden}>DOWNLOAD IMAGE</span>
                </button>
            </div>
        </div>
    )
}
