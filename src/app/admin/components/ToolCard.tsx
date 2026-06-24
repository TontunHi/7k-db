import Link from "next/link"
import v2Styles from "../admin-dashboard.module.css"
import { Marker } from "./AdminEditorial"
import { ArrowUpRight } from "lucide-react"

export default function ToolCard({ title, desc, href, markerColor }) {
    return (
        <Link href={href} className={v2Styles.toolCardMinimal}>
            <div className={v2Styles.toolCardHeader}>
                <div className="flex items-center gap-2">
                    <Marker color={markerColor} className="w-1 h-3.5" />
                    <h3 className={v2Styles.toolTitle}>{title}</h3>
                </div>
                <ArrowUpRight size={12} className={v2Styles.arrowIcon} />
            </div>
            <p className={v2Styles.toolDesc}>{desc}</p>
            <div className={v2Styles.toolCardFooter}>
                <span className="text-[8px] font-black tracking-widest text-[#FFD700]/60 uppercase">LAUNCH MODULE</span>
            </div>
        </Link>
    )
}
