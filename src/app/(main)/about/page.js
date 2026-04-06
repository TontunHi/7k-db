import SafeImage from "@/components/shared/SafeImage"

export const metadata = {
    title: "About 7K DB",
    description: "Learn more about the Seven Knights Rebirth Database project."
}

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl font-sans tracking-tight leading-relaxed">
            <div className="text-center mb-20">
                <h1 className="text-5xl md:text-7xl font-black text-white italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight">
                    ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-amber-500 to-[#FFA500]">7K DB</span>
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-[#FFD700] to-transparent mx-auto"></div>
            </div>

            <div className="space-y-16 text-gray-300">
                <section className="relative">
                    <div className="absolute -left-8 top-0 text-7xl font-black text-white/5 select-none transform -skew-x-12 uppercase tracking-tighter">Mission</div>
                    <div className="relative">
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="w-8 h-px bg-[#FFD700]"></span>
                            The Vision
                        </h2>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            7K DB is a comprehensive, fan-made resource dedicated to the world of Seven Knights Rebirth. Our mission is to provide players with accurate, up-to-date information on heroes, builds, and strategies to conquer the game's toughest challenges.
                        </p>
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="w-8 h-px bg-amber-500"></span>
                            Community Made
                        </h2>
                        <p className="text-gray-400 font-light mb-6">
                            This project is built for the community, by the community. We are passionate about the Seven Knights franchise and want to ensure every player has the tools they need to succeed in PVP and PVE modes.
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#FFD700] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <div className="relative p-8 rounded-3xl bg-black/40 border border-gray-800 shadow-2xl backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <SafeImage src="/about_website/logo_website.webp" alt="Logo" width={100} height={40} />
                            </div>
                            <h3 className="text-xl font-black text-[#FFD700] italic transform -skew-x-6 uppercase mb-4">Un-Official Resource</h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">
                                Please note that 7K DB is not affiliated with, endorsed by, or associated with the official developers or publishers of Seven Knights. All game-related assets are trademarks of their respective owners.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="pt-10 border-t border-gray-800/50 text-center">
                    <p className="text-gray-600 text-sm mb-6 uppercase tracking-[0.2em] font-bold italic">
                        Built with cutting-edge tech for the best experience.
                    </p>
                </section>
            </div>
        </div>
    )
}
