import { ShieldCheck, EyeOff, Link as LinkIcon } from "lucide-react"

export const metadata = {
    title: "Privacy Policy | 7K DB",
    description: "Our Privacy Policy for the Seven Knights Rebirth Database."
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl font-sans tracking-tight leading-relaxed">
            <div className="mb-16 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                <h1 className="text-4xl md:text-6xl font-black text-foreground italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight">
                    PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">POLICY</span>
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <PolicyCard 
                    icon={ShieldCheck} 
                    title="Data Transparency" 
                    color="text-primary"
                    bg="bg-primary/10"
                    border="border-primary/20"
                >
                    7K DB is built for the player experience. We do not require account registration, and we do not collect personal identifying information (PII) from our users. Your privacy is paramount.
                </PolicyCard>

                <PolicyCard 
                    icon={EyeOff} 
                    title="Site Analytics" 
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    border="border-amber-500/20"
                >
                    We use minimal, anonymous analytics to understand site traffic and usage patterns. This data helps us optimize the user experience and ensures the site remains fast and accessible for everyone.
                </PolicyCard>

                <div className="md:col-span-2">
                    <PolicyCard 
                        icon={LinkIcon} 
                        title="External Platforms" 
                        color="text-orange-500"
                        bg="bg-orange-500/10"
                        border="border-orange-500/20"
                    >
                        Our site may contain links to external platforms such as YouTube, Discord, or official game communities. We recommend reviewing their respective privacy policies as they are separate from 7K DB.
                    </PolicyCard>
                </div>
            </div>

            <section className="pt-10 border-t border-border/50 text-center">
                <p className="text-muted-foreground/60 text-xs uppercase tracking-widest font-black italic">
                    Last Modified: April 2026
                </p>
            </section>
        </div>
    )
}

function PolicyCard({ icon: Icon, title, children, color, bg, border }) {
    return (
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            <div className={`absolute -right-10 -top-10 w-40 h-40 ${bg} blur-[60px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity`} />
            <div className={`w-14 h-14 rounded-2xl ${bg} ${border} border flex items-center justify-center mb-6 relative z-10`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-4 relative z-10">
                {title}
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed relative z-10">
                {children}
            </p>
        </div>
    )
}
