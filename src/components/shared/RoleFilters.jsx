import Image from 'next/image'
import { clsx } from 'clsx'
import styles from './RoleFilters.module.css'

const ROLE_FILTERS = [
    { key: "all",       label: "All",       icon: null },
    { key: "Attack",    label: "Attack",    icon: "/logo_tiers/type/attack.webp" },
    { key: "Defense",   label: "Defense",   icon: "/logo_tiers/type/defense.webp" },
    { key: "Magic",     label: "Magic",     icon: "/logo_tiers/type/magic.webp" },
    { key: "Support",   label: "Support",   icon: "/logo_tiers/type/support.webp" },
    { key: "Universal", label: "Universal", icon: "/logo_tiers/type/universal.webp" },
]

export default function RoleFilters({ activeRole, onRoleChange }) {
    return (
        <div className={styles.roles}>
            {ROLE_FILTERS.map((role) => (
                <button
                    key={role.key}
                    onClick={() => onRoleChange(role.key)}
                    className={clsx(styles.roleButton, activeRole === role.key && styles.roleButtonActive)}
                >
                    {role.icon ? (
                        <div className={styles.roleIconWrapper}>
                            <Image src={role.icon} alt={role.label} fill className="object-contain" />
                        </div>
                    ) : (
                        <span className={styles.roleStar}>★</span>
                    )}
                    {role.label}
                </button>
            ))}
        </div>
    )
}
