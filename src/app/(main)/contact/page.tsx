import { Mail, MessageCircle, Send, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import ContactForm from "@/components/contact/ContactForm"
import { isContactFormEnabled } from "@/lib/setting-actions"

export const metadata = {
    title: "Contact Us | 7K DB",
    description: "Reach out to the 7K DB team for feedback, suggestions, or bug reports."
}

export default async function ContactPage() {
    const isEnabled = await isContactFormEnabled()

    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl font-sans tracking-tight leading-relaxed">
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-orange-500/20 blur-[100px] -z-10 rounded-full" />
                <h1 className="text-5xl md:text-7xl font-black text-foreground italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight animate-in fade-in slide-in-from-top-8 duration-700">
                    GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">TOUCH</span>
                </h1>
                <p className="text-muted-foreground text-lg font-light tracking-wide max-w-xl mx-auto animate-in fade-in duration-1000 delay-200">
                    We&apos;re always looking for feedback, guide contributions, or bug reports. Choose a method below to reach us!
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-transparent mx-auto mt-8"></div>
            </div>

            <div className="flex justify-center mb-12 px-4 animate-in fade-in duration-1000 delay-300">
                <div className="max-w-md w-full">
                    <ContactCard 
                        icon={Mail} 
                        label="Email" 
                        value="pisutyimkuson@gmail.com" 
                        link="mailto:pisutyimkuson@gmail.com"
                        desc="For general inquiries and partnerships." 
                    />
                </div>
            </div>

            <div className="max-w-2xl mx-auto mb-20 animate-in fade-in duration-1000 delay-500">
                {isEnabled ? (
                    <div className="bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-50" />
                        <h2 className="text-2xl font-black text-foreground uppercase italic mb-8 flex items-center gap-3 relative z-10">
                            <Send className="w-6 h-6 text-orange-500" />
                            Send a Message
                        </h2>
                        <div className="relative z-10">
                            <ContactForm />
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground uppercase mb-2">Messaging Offline</h3>
                        <p className="text-muted-foreground font-light text-sm max-w-sm mx-auto">
                            The contact form is currently closed. Please reach out via email instead.
                        </p>
                    </div>
                )}
            </div>

            <div className="p-8 rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
                
                <h2 className="text-xl font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-4">
                    <span className="w-8 h-px bg-primary"></span>
                    Community Contributions
                </h2>
                <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                    <p>
                        We are a community-driven project. If you have an optimized build or a new stage strategy that isn&apos;t on the site yet, we&rsquo;d love to hear it.
                    </p>
                    <p className="text-sm">
                        Contributors who provide accurate and useful guides may be featured in our &quot;Contributors List&quot; coming soon!
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
                "p-8 rounded-3xl bg-surface border border-border transition-all duration-300 group flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 block relative overflow-hidden",
                link ? "hover:border-orange-500/50 cursor-pointer" : ""
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 transition-all mb-6 relative z-10">
                <Icon size={24} strokeWidth={2} />
            </div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 relative z-10">{label}</h3>
            <p className="text-lg font-black text-foreground italic transform -skew-x-6 tracking-tight mb-4 group-hover:text-orange-500 transition-colors leading-tight relative z-10">{value}</p>
            <p className="text-sm text-muted-foreground font-light leading-snug relative z-10">{desc}</p>
        </Component>
    )
}
