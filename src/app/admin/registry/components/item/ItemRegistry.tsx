"use client"

import { Plus, Edit3, Trash2, X, Save, Loader2, Sword } from "lucide-react"
import { useItemRegistry } from "../../hooks/useItemRegistry"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./ItemRegistry.module.css"
import { clsx } from "clsx"

const ITEM_TYPES = ["Weapon", "Armor", "Accessory"]
const ITEM_SETS = [
    "Vanguard", "Bounty Tracker", "Paladin", "Avenger", 
    "Orchestrator", "Spellweaver", "Assassin", "Gatekeeper", "Guardian"
]

export default function ItemRegistry({ initialData, assets = {} }) {
    const {
        items,
        isModalOpen,
        editingItem,
        formData,
        isSaving,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        updateFormField
    } = useItemRegistry(initialData)

    const getAssetPath = () => {
        if (formData.item_type === "Weapon") return "/items/weapon"
        if (formData.item_type === "Armor") return "/items/armor"
        if (formData.item_type === "Accessory") return "/items/accessory"
        return "/items"
    }

    const availableAssets = assets[formData.item_type] || []

    return (
        <div className={styles.container}>
            {/* Header Actions */}
            <div className={styles.actionsHeader}>
                <button 
                    onClick={() => openModal()}
                    className={styles.registerButton}
                >
                    <Plus className={styles.icon} />
                    Register New Item
                </button>
            </div>

            {/* Table Section */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Item Identity</th>
                                <th className={styles.th}>Primary Stats (+15)</th>
                                <th className={clsx(styles.th, "text-right")}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.itemCell}>
                                            <div className={styles.itemImageWrapper}>
                                                <SafeImage 
                                                    src={item.image ? `/items/${item.item_type.toLowerCase()}/${item.image}` : null} 
                                                    fill 
                                                    className="object-cover" 
                                                    alt={item.name} 
                                                />
                                            </div>
                                            <div>
                                                <div className={styles.itemName}>{item.name}</div>
                                                <div className={styles.badgeContainer}>
                                                    <span className={clsx(styles.badge, styles.badgeType)}>{item.item_type}</span>
                                                    {item.item_type === "Weapon" && (
                                                        <span className={clsx(
                                                            styles.badge,
                                                            item.weapon_group === "Physical" ? styles.badgePhysical : styles.badgeMagic
                                                        )}>
                                                            {item.weapon_group}
                                                        </span>
                                                    )}
                                                    {item.item_set && (
                                                        <span className={clsx(styles.badge, styles.badgeSet)}>set: {item.item_set}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.statsContainer}>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>ATK</span>{item.atk_all_perc}
                                            </span>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>DEF</span>{item.def_perc}
                                            </span>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>HP</span>{item.hp_perc}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actionsCell}>
                                            <button 
                                                onClick={() => openModal(item)} 
                                                className={styles.actionButton}
                                                title="Edit Item"
                                            >
                                                <Edit3 className={styles.icon} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)} 
                                                className={clsx(styles.actionButton, styles.deleteButton)}
                                                title="Delete Item"
                                            >
                                                <Trash2 className={styles.icon} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={3} className={styles.emptyRow}>
                                        No items registered yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration/Edit Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <header className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                <Sword className="w-5 h-5 text-emerald-500" />
                                {editingItem ? "Edit Item" : "Register Item"}
                            </h3>
                            <button onClick={closeModal} className={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Item Name</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormField("name", e.target.value)}
                                    required
                                    className={styles.input}
                                    placeholder="Enter item name..."
                                />
                            </div>

                            <div className={styles.gridRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Item Type</label>
                                    <select 
                                        value={formData.item_type}
                                        onChange={(e) => updateFormField("item_type", e.target.value)}
                                        className={styles.select}
                                    >
                                        {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                {formData.item_type === "Weapon" && (
                                    <div className={styles.fieldGroup}>
                                        <label className={styles.label}>Weapon Group</label>
                                        <select 
                                            value={formData.weapon_group || "Physical"}
                                            onChange={(e) => updateFormField("weapon_group", e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="Physical">Physical</option>
                                            <option value="Magic">Magic</option>
                                        </select>
                                    </div>
                                )}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Item Set</label>
                                    <select 
                                        value={formData.item_set || ""}
                                        onChange={(e) => updateFormField("item_set", e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="">No Set</option>
                                        {ITEM_SETS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Asset Image</label>
                                <select 
                                    value={formData.image}
                                    onChange={(e) => updateFormField("image", e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select Image</option>
                                    {availableAssets.map(img => (
                                        <option key={img} value={img}>{img}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>Atk Value</label>
                                    <input 
                                        type="number"
                                        value={formData.atk_all_perc}
                                        onChange={(e) => updateFormField("atk_all_perc", parseFloat(e.target.value) || 0)}
                                        className={clsx(styles.input, styles.statInput)}
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>Def Value</label>
                                    <input 
                                        type="number"
                                        value={formData.def_perc}
                                        onChange={(e) => updateFormField("def_perc", parseFloat(e.target.value) || 0)}
                                        className={clsx(styles.input, styles.statInput)}
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>HP Value</label>
                                    <input 
                                        type="number"
                                        value={formData.hp_perc}
                                        onChange={(e) => updateFormField("hp_perc", parseFloat(e.target.value) || 0)}
                                        className={clsx(styles.input, styles.statInput)}
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            {formData.image && (
                                <div className={styles.previewBox}>
                                    <div className={styles.previewLabel}>Asset Preview</div>
                                    <div className={styles.previewImageWrapper}>
                                        <SafeImage 
                                            src={`${getAssetPath()}/${formData.image}`} 
                                            fill 
                                            className="object-cover" 
                                            alt="preview" 
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className={styles.submitButton}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {editingItem ? "Update Item" : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
