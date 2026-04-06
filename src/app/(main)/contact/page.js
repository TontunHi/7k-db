import { Mail, MessageCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = {
    title: "Contact Us | 7K DB",
    description: "Reach out to the 7K DB team for feedback, suggestions, or bug reports."
}

const DiscordIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
)

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl font-sans tracking-tight leading-relaxed">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-white italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight">
                    GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">TOUCH</span>
                </h1>
                <p className="text-gray-500 text-lg font-light tracking-wide max-w-xl mx-auto">
                    We're always looking for feedback, guide contributions, or bug reports. Choose a method below to reach us!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20 px-4 max-w-2xl mx-auto">
                <ContactCard 
                    icon={Mail} 
                    label="Email" 
                    value="pisutyimkuson@gmail.com" 
                    link="mailto:pisutyimkuson@gmail.com"
                    desc="For general inquiries and partnerships." 
                />
                <ContactCard 
                    icon={DiscordIcon} 
                    label="Discord" 
                    value="Seven Knights : RB | DB Community" 
                    link="https://discord.gg/B8kN42677v"
                    desc="Join our community for real-time discussion." 
                />
            </div>

            <div className="p-8 rounded-3xl bg-black/40 border border-gray-800 shadow-2xl backdrop-blur-sm overflow-hidden relative group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
                
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary"></span>
                    Community Contributions
                </h2>
                <div className="space-y-6 text-gray-400 font-light leading-relaxed">
                    <p>
                        We are a community-driven project. If you have an optimized build or a new stage strategy that isn't on the site yet, we’d love to hear it.
                    </p>
                    <p className="text-sm">
                        Contributors who provide accurate and useful guides may be featured in our "Contributors List" coming soon!
                    </p>
                </div>
            </div>
        </div>
    )
}

function ContactCard({ icon: Icon, label, value, desc, link }) {
    const Component = link ? "a" : "div"
    const extraProps = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {}

    return (
        <Component 
            {...extraProps}
            className={cn(
                "p-8 rounded-2xl bg-[#0a0a0a] border border-gray-800 transition-all duration-300 group flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 block",
                link ? "hover:border-primary/50 cursor-pointer" : "hover:border-gray-700"
            )}
        >
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:text-primary transition-all mb-6 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">{label}</h3>
            <p className="text-lg font-black text-white italic transform -skew-x-6 tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">{value}</p>
            <p className="text-sm text-gray-500 font-light leading-snug">{desc}</p>
        </Component>
    )
}
