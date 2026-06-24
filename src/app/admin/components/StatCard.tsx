import v2Styles from "../admin-dashboard.module.css"
import { Eye, Users, TrendingUp, Zap } from "lucide-react"

export default function StatCard({ label, value, type }) {
    const getIcon = () => {
        switch (type) {
            case "total_views":
                return <Eye size={18} className="text-blue-400" />;
            case "unique_users":
                return <Users size={18} className="text-emerald-400" />;
            case "views_today":
                return <TrendingUp size={18} className="text-red-400" />;
            case "users_today":
                return <Zap size={18} className="text-amber-400" />;
            default:
                return null;
        }
    }

    const getGlowClass = () => {
        switch (type) {
            case "total_views":
                return v2Styles.statGlowBlue;
            case "unique_users":
                return v2Styles.statGlowGreen;
            case "views_today":
                return v2Styles.statGlowRed;
            case "users_today":
                return v2Styles.statGlowYellow;
            default:
                return "";
        }
    }

    return (
        <div className={`${v2Styles.statCard} ${getGlowClass()}`}>
            <div className={v2Styles.statHeader}>
                <span className={v2Styles.statLabel}>{label}</span>
                <div className={v2Styles.statIconBadge}>{getIcon()}</div>
            </div>
            <div className={v2Styles.statValue}>{value}</div>
            <div className={v2Styles.statSubText}>Live telemetry data</div>
        </div>
    )
}
