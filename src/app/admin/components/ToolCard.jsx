import Link from "next/link"
import { ArrowRight } from "lucide-react"
import styles from "../admin-dashboard.module.css"

export default function ToolCard({ title, desc, icon: Icon, href, iconBg }) {
    return (
        <Link href={href} className={styles.toolCard}>
            <div className={`${styles.toolIconWrapper} ${iconBg}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div className="flex-1">
                <h3 className={styles.toolTitle}>{title}</h3>
                <p className={styles.toolDesc}>{desc}</p>
            </div>
            <ArrowRight size={16} className={styles.toolArrow} />
        </Link>
    )
}
