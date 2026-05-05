"use client"

import { Plus, Edit3, Trash2, X, Save, Loader2, Sparkles } from "lucide-react"
import { usePetRegistry } from "../../hooks/usePetRegistry"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./PetRegistry.module.css"
import { clsx } from "clsx"

const GRADES = ["r", "l"]

export default function PetRegistry({ initialData, assets = [] }) {
    const {
        pets,
        isModalOpen,
        editingPet,
        formData,
        isSaving,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        updateFormField
    } = usePetRegistry(initialData)

    return (
        <div className={styles.container}>
            {/* Header Actions */}
            <div className={styles.actionsHeader}>
                <button 
                    onClick={() => openModal()}
                    className={styles.registerButton}
                >
                    <Plus className={styles.icon} />
                    Register New Pet
                </button>
            </div>

            {/* Table Section */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Pet Identity</th>
                                <th className={styles.th}>Base Stats (+5)</th>
                                <th className={clsx(styles.th, "text-right")}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map((pet) => (
                                <tr key={pet.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <div className={styles.petCell}>
                                            <div className={styles.petImageWrapper}>
                                                <SafeImage 
                                                    src={pet.image ? `/pets/${pet.image}` : null} 
                                                    fill 
                                                    className="object-cover" 
                                                    alt={pet.name} 
                                                />
                                            </div>
                                            <div>
                                                <div className={styles.petName}>{pet.name}</div>
                                                <div className={styles.petGrade}>{pet.grade} GRADE</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.statsContainer}>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>ATK</span>{pet.atk_all}
                                            </span>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>DEF</span>{pet.def}
                                            </span>
                                            <span className={styles.statItem}>
                                                <span className={styles.statLabel}>HP</span>{pet.hp}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actionsCell}>
                                            <button 
                                                onClick={() => openModal(pet)} 
                                                className={styles.actionButton}
                                                title="Edit Pet"
                                            >
                                                <Edit3 className={styles.icon} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(pet.id)} 
                                                className={clsx(styles.actionButton, styles.deleteButton)}
                                                title="Delete Pet"
                                            >
                                                <Trash2 className={styles.icon} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pets.length === 0 && (
                                <tr>
                                    <td colSpan={3} className={styles.emptyRow}>
                                        No pets registered yet
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
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                {editingPet ? "Edit Pet" : "Register Pet"}
                            </h3>
                            <button onClick={closeModal} className={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Pet Name</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormField("name", e.target.value)}
                                    required
                                    className={styles.input}
                                    placeholder="Enter pet name..."
                                />
                            </div>

                            <div className={styles.gridRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Grade</label>
                                    <select 
                                        value={formData.grade}
                                        onChange={(e) => updateFormField("grade", e.target.value)}
                                        className={styles.select}
                                    >
                                        {GRADES.map(g => (
                                            <option key={g} value={g}>{g.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Asset Image</label>
                                    <select 
                                        value={formData.image}
                                        onChange={(e) => updateFormField("image", e.target.value)}
                                        className={styles.select}
                                    >
                                        <option value="">Select Image</option>
                                        {assets.map(img => (
                                            <option key={img} value={img}>{img}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.statsGrid}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>All Atk</label>
                                    <input 
                                        type="number"
                                        value={formData.atk_all}
                                        onChange={(e) => updateFormField("atk_all", parseInt(e.target.value) || 0)}
                                        className={clsx(styles.input, styles.statInput)}
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>Defense</label>
                                    <input 
                                        type="number"
                                        value={formData.def}
                                        onChange={(e) => updateFormField("def", parseInt(e.target.value) || 0)}
                                        className={clsx(styles.input, styles.statInput)}
                                    />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.statLabelMini}>HP</label>
                                    <input 
                                        type="number"
                                        value={formData.hp}
                                        onChange={(e) => updateFormField("hp", parseInt(e.target.value) || 0)}
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
                                            src={`/pets/${formData.image}`} 
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
                                    {editingPet ? "Update Pet" : "Save Pet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
