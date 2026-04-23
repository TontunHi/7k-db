"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import styles from "../admin-dashboard.module.css"

export default function ToolCard({ title, desc, icon: Icon, href, color }) {
    return (
        <Link href={href} className={styles.toolCard}>
            <div className={`${styles.toolIconWrapper} ${color}`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className={styles.toolTitle}>{title}</h3>
                <p className={styles.toolDesc}>{desc}</p>
            </div>
            <ChevronRight className={styles.toolArrow} size={16} />
            <div className={styles.toolHighlight} />
        </Link>
    )
}
