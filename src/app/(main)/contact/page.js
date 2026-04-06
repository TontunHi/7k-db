import { Mail, MessageCircle, Send } from "lucide-react"

export const metadata = {
    title: "Contact Us | 7K DB",
    description: "Reach out to the 7K DB team for feedback, suggestions, or bug reports."
}

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

            <div className="grid md:grid-cols-3 gap-8 mb-20 px-4">
                <ContactCard 
                    icon={Mail} 
                    label="Email" 
                    value="contact@7kdb.com" 
                    desc="For general inquiries and partnerships." 
                />
                <ContactCard 
                    icon={MessageCircle} 
                    label="Discord" 
                    value="7k-db-community" 
                    desc="Join our community for real-time discussion." 
                />
                <ContactCard 
                    icon={Send} 
                    label="Feedback Form" 
                    value="Send Now" 
                    desc="Quickly submit a bug or suggestion." 
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

function ContactCard({ icon: Icon, label, value, desc }) {
    return (
        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-primary/50 transition-all duration-300 group flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:text-primary transition-all mb-6 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest mb-2">{label}</h3>
            <p className="text-lg font-black text-white italic transform -skew-x-6 tracking-tight mb-4 group-hover:text-primary transition-colors">{value}</p>
            <p className="text-sm text-gray-500 font-light leading-snug">{desc}</p>
        </div>
    )
}
