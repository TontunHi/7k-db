"use client"

import { UploadCloud, Search, ImageIcon, Loader2, Folder, ArrowLeft } from 'lucide-react'
import { useAssetManager } from '../hooks/useAssetManager'
import AssetCard from './AssetCard'
import styles from '../assets.module.css'
import { clsx } from 'clsx'

export default function AssetManagerView() {
    const {
        heroes,
        pets,
        skills,
        loading,
        uploading,
        activeTab,
        setActiveTab,
        search,
        setSearch,
        skillFolder,
        setSkillFolder,
        handleUpload,
        handleDelete
    } = useAssetManager()

    const uniqueFolders = [...new Set(skills.map(s => s.folder))]
        .filter(f => search ? f.toLowerCase().includes(search.toLowerCase()) : true)

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.headerCard}>
                <div className={styles.headerContent}>
                    <div className={styles.iconBox}>
                        <ImageIcon className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <div>
                        <h1 className={styles.title}>Asset Manager</h1>
                        <p className={styles.subtitle}>Directly manage Hero, Pet, and Skill image assets on the server.</p>
                    </div>
                </div>
            </header>

            {/* Controls Bar */}
            <div className={styles.controlsBar}>
                <nav className={styles.tabs}>
                    {['heroes', 'pets', 'skills'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(styles.tabButton, activeTab === tab && styles.activeTab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div className={styles.rightControls}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <div className={styles.uploadWrapper}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading || (activeTab === 'skills' && !skillFolder)}
                            className={styles.fileInput}
                        />
                        <button 
                            className={styles.uploadButton}
                            disabled={uploading || (activeTab === 'skills' && !skillFolder)}
                        >
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Skill Folder Management */}
            {activeTab === 'skills' && (
                skillFolder ? (
                    <div className={styles.folderInfo}>
                        <button onClick={() => setSkillFolder('')} className={styles.backButton}>
                            <ArrowLeft className="w-4 h-4" /> Back to Folders
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-2" />
                        <label className={styles.folderLabel}>Uploading to:</label>
                        <div className={styles.folderName}>{skillFolder}</div>
                    </div>
                ) : (
                    <div className={styles.createFolderBox}>
                        <label className={styles.folderLabel}>Create / Find Folder:</label>
                        <div className={styles.folderInputWrapper}>
                            <input 
                                list="hero-folders" 
                                id="new-folder-input"
                                placeholder="e.g. l+_eileene"
                                className={styles.searchInput}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                        setSkillFolder(e.currentTarget.value)
                                    }
                                }}
                            />
                            <button 
                                onClick={() => {
                                    const val = (document.getElementById('new-folder-input') as HTMLInputElement)?.value
                                    if (val) setSkillFolder(val)
                                }}
                                className={styles.openButton}
                            >
                                Open
                            </button>
                            <datalist id="hero-folders">
                                {[...new Set(heroes.map(h => h.filename?.replace(/\.[^/.]+$/, '')))]
                                    .filter(Boolean)
                                    .map(folder => <option key={folder} value={folder} />)}
                            </datalist>
                        </div>
                    </div>
                )
            )}

            {/* Content Grid */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className={styles.loader} />
                </div>
            ) : (
                <div className={styles.grid}>
                    {activeTab === 'heroes' && heroes
                        .filter(h => h.filename && h.filename.toLowerCase().includes(search.toLowerCase()))
                        .map(h => (
                            <AssetCard 
                                key={h.filename}
                                src={`/heroes/${h.filename}`}
                                filename={h.filename}
                                onDelete={handleDelete}
                            />
                        ))}

                    {activeTab === 'pets' && pets
                        .filter(p => p.toLowerCase().includes(search.toLowerCase()))
                        .map(p => (
                            <AssetCard 
                                key={p}
                                src={p}
                                filename={p}
                                onDelete={handleDelete}
                                variant="square"
                            />
                        ))}

                    {activeTab === 'skills' && !skillFolder && uniqueFolders.map(folder => (
                        <div 
                            key={folder} 
                            onClick={() => setSkillFolder(folder)} 
                            className={styles.folderCard}
                        >
                            <Folder className={styles.folderIcon} />
                            <span className={styles.folderNameText}>{folder}</span>
                            <span className={styles.fileCount}>
                                {skills.filter(s => s.folder === folder).length} files
                            </span>
                        </div>
                    ))}

                    {activeTab === 'skills' && skillFolder && skills
                        .filter(s => s.folder === skillFolder)
                        .filter(s => s.filename.toLowerCase().includes(search.toLowerCase()))
                        .map(s => (
                            <AssetCard 
                                key={s.path}
                                src={s.path}
                                filename={s.filename}
                                onDelete={(fn) => handleDelete(fn, s.folder)}
                                variant="square"
                            />
                        ))}

                    {/* Empty States */}
                    {((activeTab === 'heroes' && !heroes.length) || 
                      (activeTab === 'pets' && !pets.length) || 
                      (activeTab === 'skills' && !skills.length)) && (
                        <div className={styles.emptyState}>No assets found.</div>
                    )}
                    {activeTab === 'skills' && !skillFolder && uniqueFolders.length === 0 && (
                        <div className={styles.emptyState}>No skill folders found mapping to your search.</div>
                    )}
                </div>
            )}
        </div>
    )
}
