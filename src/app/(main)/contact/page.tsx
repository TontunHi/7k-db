import { Mail, Send, AlertTriangle, Award } from "lucide-react"
import ContactForm from "@/components/contact/ContactForm"
import { isContactFormEnabled } from "@/lib/setting-actions"
import { getLocale, getTranslations } from "@/lib/i18n"

export const metadata = {
    title: "Contact Us | 7K DB",
    description: "Reach out to the 7K DB team for feedback, suggestions, or bug reports."
}

export default async function ContactPage() {
    const isEnabled = await isContactFormEnabled()
    const lang = await getLocale()
    const translations = await getTranslations(lang)
    const t = (key: string, defaultVal: string) => translations[key] || defaultVal

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
            
            {/* Decorative background grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)',
                     backgroundSize: '40px 40px' 
                 }} 
            />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif text-foreground">
                        {lang === 'th' ? 'ติดต่อ' : 'Get in '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-primary to-yellow-200">{lang === 'th' ? 'เรา' : 'Touch'}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-lg mx-auto">
                        {t("contact.desc", "We're always looking for feedback, guide contributions, or bug reports. Choose a method below to reach us!")}
                    </p>
                </div>

                {/* Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Direct Info & Contributions (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Direct Contact Card */}
                        <div className="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:border-primary/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Direct Email</h3>
                                    <a href="mailto:pisutyimkuson@gmail.com" className="text-base font-bold text-foreground hover:text-primary transition-colors">
                                        pisutyimkuson@gmail.com
                                    </a>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                {t("contact.email_desc", "For general inquiries, collaboration proposals, or urgent system reports.")}
                            </p>
                        </div>

                        {/* Guidelines / Contribution Card */}
                        <div className="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Award size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Community Data</h3>
                                    <h4 className="text-sm font-bold text-foreground">{t("contact.contribution_title", "Contributions")}</h4>
                                </div>
                            </div>
                            <div className="space-y-4 text-xs text-muted-foreground font-light leading-relaxed">
                                <p>
                                    {t("contact.contribution_desc1", "We are a community-driven project. If you have an optimized build or a new stage strategy that isn't on the site yet, we'd love to hear it.")}
                                </p>
                                <p className="text-[10px] text-primary/80 bg-primary/5 border border-primary/10 rounded-xl p-3">
                                    {t("contact.contribution_desc2", "Contributors who provide accurate and useful guides may be featured in our \"Contributors List\" coming soon!")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Form (7 Cols) */}
                    <div className="lg:col-span-7">
                        {isEnabled ? (
                            <div className="bg-card/30 backdrop-blur-lg border border-border/80 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-600 via-primary to-yellow-200" />
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                                
                                <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-3 text-foreground font-serif">
                                    <Send className="w-5 h-5 text-primary" />
                                    {t("contact.message_title", "Send a Message")}
                                </h2>
                                
                                <div className="relative z-10">
                                    <ContactForm />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card/30 backdrop-blur-lg border border-border/80 rounded-3xl p-12 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-red-950/40" />
                                <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertTriangle className="w-8 h-8 text-primary/60" />
                                </div>
                                <h3 className="text-lg font-bold uppercase mb-2 text-foreground font-serif">{t("contact.offline_title", "Messaging Offline")}</h3>
                                <p className="text-muted-foreground font-light text-xs max-w-sm mx-auto leading-relaxed">
                                    {t("contact.offline_desc", "The contact form is currently closed. Please reach out via email instead.")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
