export const metadata = {
    title: "Privacy Policy | 7K DB",
    description: "Our Privacy Policy for the Seven Knights Rebirth Database."
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-3xl font-sans tracking-tight leading-relaxed">
            <div className="mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-white italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight">
                    PRIVACY <span className="text-[#FFD700]">POLICY</span>
                </h1>
                <div className="h-1 w-12 bg-gradient-to-r from-[#FFD700] to-transparent"></div>
            </div>

            <div className="space-y-12 text-gray-400 font-light">
                <section>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                        <span className="w-4 h-px bg-[#FFD700]"></span>
                        Data Transparency
                    </h2>
                    <p className="mb-4">
                        7K DB is built for the player experience. We do not require account registration, and we do not collect personal identifying information (PII) from our users. Your privacy is paramount.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                        <span className="w-4 h-px bg-amber-500"></span>
                        Site Analytics
                    </h2>
                    <p className="mb-4">
                        We use minimal, anonymous analytics to understand site traffic and usage patterns. This data helps us optimize the user experience and ensures the site remains fast and accessible for everyone.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                        <span className="w-4 h-px bg-orange-600"></span>
                        External Platforms
                    </h2>
                    <p className="mb-4">
                        Our site may contain links to external platforms such as YouTube, Discord, or official game communities. We recommend reviewing their respective privacy policies as they are separate from 7K DB.
                    </p>
                </section>

                <section className="pt-10 border-t border-gray-800/50">
                    <p className="text-gray-600 text-xs uppercase tracking-widest font-black italic">
                        Last Modified: April 2026
                    </p>
                </section>
            </div>
        </div>
    )
}
