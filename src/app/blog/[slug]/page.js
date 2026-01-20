
import { getPostBySlug } from '@/lib/blog-actions';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            {/* Navigation */}
            <div className="mb-8">
                <Link href="/" className="group flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Home
                </Link>
            </div>

            <article>
                <header className="mb-12 text-center space-y-6">
                    <div className="flex items-center justify-center gap-2 text-primary font-medium uppercase tracking-widest text-xs">
                        <span>Data Update</span>
                        <span>•</span>
                        <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), 'MMMM d, yyyy')}
                        </time>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}

                    {post.cover_image && (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 border border-border mt-8">
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    )}
                </header>

                <div
                    className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            <div className="mt-20 pt-10 border-t border-border flex flex-col items-center space-y-6">
                <p className="text-muted-foreground">Thanks for reading!</p>
                <Link href="/" className="px-8 py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground font-bold transition-all border border-primary/20 hover:border-primary/50">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
