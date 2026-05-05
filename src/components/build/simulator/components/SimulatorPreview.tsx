'use client'
import { Copy, Download, Eye, Edit3 } from 'lucide-react'
import { clsx } from 'clsx'
import BuildCardExport from './BuildCardExport'
import styles from './SimulatorPreview.module.css'

export default function SimulatorPreview({ 
    hero, build, displaySkills, exportRef, containerRef, scale, 
    handleExport, showMobilePreview, setShowMobilePreview 
}) {
    return (
        <>
            <div 
                ref={containerRef}
                className={clsx(
                    styles.preview,
                    !showMobilePreview && styles.hiddenMobile
                )}
            >
                {/* Background Effects */}
                <div className={styles.backgroundEffects}>
                    <div className={styles.glow} />
                </div>

                {/* Scaled Wrapper */}
                <div 
                    className={styles.cardScaledWrapper}
                    style={{ 
                        width: 1200 * scale, 
                        height: 630 * scale,
                        transition: 'all 0.3s ease-out'
                    }}
                >
                    <div 
                        className={styles.cardScaler} 
                        style={{ 
                            width: 1200, 
                            height: 630, 
                            transform: `scale(${scale})` 
                        }}
                    >
                        <p className={styles.livePreviewLabel}>Live Preview</p>
                        <div className={styles.cardContainer}>
                            <div className={styles.cardInner}>
                                <BuildCardExport ref={exportRef} hero={hero} build={build} skills={displaySkills} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons */}
                <div className={styles.actions}>
                    <button 
                        onClick={() => handleExport('copy')}
                        className={styles.btnCopy}
                    >
                        <Copy size={20} className={styles.copyIcon} /> 
                        <span>Copy Image</span>
                    </button>
                    <button 
                        onClick={() => handleExport('download')}
                        className={styles.btnDownload}
                    >
                        <Download size={20} /> 
                        <span>Download Image</span>
                    </button>
                </div>
            </div>

            {/* Mobile Floating Toggle Button */}
            <button 
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className={styles.mobileToggle}
            >
                {showMobilePreview ? (
                    <>
                        <Edit3 size={16} />
                        <span>Edit Build</span>
                    </>
                ) : (
                    <>
                        <Eye size={16} />
                        <span>View Preview</span>
                    </>
                )}
            </button>
        </>
    )
}
