

import { getPosts } from "@/lib/blog-actions"
import LatestPost from "@/components/LatestPost"


export default async function HomePage() {
    const { posts } = await getPosts(1, 6)

    return (
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative text-center space-y-8 py-20 px-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50 pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shine bg-clip-text text-transparent pb-4 drop-shadow-sm">
                    Seven Knights Rebirth
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                    Your ultimate resource for heroes, builds, and strategies. <br />
                    <span className="text-foreground font-normal">Built by fans, for fans.</span>
                </p>
            </section>

            {/* Latest Updates (Blog) */}
            <section className="px-4">

                {posts.length > 0 ? (
                    <LatestPost post={posts[0]} />
                ) : (
                    <div className="h-[30vh] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-secondary/5">
                        <p className="text-muted-foreground font-mono text-lg mb-4">No updates posted yet.</p>
                        <p className="text-sm text-muted-foreground/50">Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    )
}
