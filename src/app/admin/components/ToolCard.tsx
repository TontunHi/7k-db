"use client"

import Link from "next/link"
import styles from "../admin-dashboard.module.css"
import { Marker, ActionLabel } from "./AdminEditorial"

export default function ToolCard({ title, href, marker }) {
    return (
        <Link href={href} className={styles.toolCard}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <Marker color={marker} className="h-6" />
                    <h3 className={styles.toolTitle}>{title}</h3>
                </div>
                <ActionLabel label="OPEN" className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className={styles.toolHighlight} />
        </Link>
    )
}
