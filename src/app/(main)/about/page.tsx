export const metadata = {
    title: "About 7K DB",
    description: "Learn more about the Seven Knights Rebirth Database project."
}

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl font-sans tracking-tight leading-relaxed">
            <div className="text-center mb-20 relative">
                {/* Title Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                
                <h1 className="text-5xl md:text-7xl font-black text-foreground italic transform -skew-x-12 uppercase mb-6 drop-shadow-lg leading-tight">
                    ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">7K DB</span>
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent mx-auto"></div>
            </div>

            <div className="space-y-12">
                <section className="relative p-8 md:p-12 rounded-3xl bg-surface border border-border shadow-xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full group-hover:bg-primary/10 transition-colors duration-500" />
                    <div className="absolute -left-8 top-4 text-7xl font-black text-foreground/5 select-none transform -skew-x-12 uppercase tracking-tighter hidden md:block">Mission</div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="w-8 h-px bg-primary"></span>
                            The Vision
                        </h2>
                        <p className="text-lg text-muted-foreground font-light leading-relaxed">
                            7K DB is the most comprehensive and up-to-date resource dedicated to Seven Knights Rebirth. Our vision is to provide players with the ultimate tools, precise hero builds, and expert strategies to master every aspect of the game.
                        </p>
                    </div>
                </section>

                <section className="relative p-8 md:p-12 rounded-3xl bg-surface border border-border shadow-xl overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors duration-500" />
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-4">
                            <span className="w-8 h-px bg-amber-500"></span>
                            Community Made
                            <span className="w-8 h-px bg-amber-500"></span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-light mb-6 leading-relaxed">
                            This project is built for the community, by the community. We are passionate about the Seven Knights franchise and want to ensure every player has the tools they need to succeed in PVP and PVE modes.
                        </p>
                    </div>
                </section>

                <section className="pt-10 text-center">
                    <p className="text-muted-foreground/60 text-sm uppercase tracking-[0.2em] font-bold italic">
                        Built with cutting-edge tech for the best experience.
                    </p>
                </section>
            </div>
        </div>
    )
}
