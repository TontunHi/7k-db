"use client"

import Link from "next/link"
import styles from "../admin-dashboard.module.css"
import { Marker, ActionLabel } from "./AdminEditorial"

export default function ToolCard({ title, href, markerColor = "bg-primary" }) {
    return (
        <Link href={href} className={styles.toolCardMinimal}>
            <div className="flex items-center gap-3">
                <Marker color={markerColor} />
                <div className={styles.toolTitle}>{title}</div>
            </div>
        </Link>
    )
}
