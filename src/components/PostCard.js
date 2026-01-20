
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostCard({ post }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/50 h-full">
            {post.cover_image && (
                <div className="relative aspect-video w-full overflow-hidden bg-secondary/20">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            <div className="flex flex-col flex-1 p-5">
                <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
                    {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0 z-10" />
                        {post.title}
                    </Link>
                </h3>
                {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                        {post.excerpt}
                    </p>
                )}
            </div>
        </div>
    );
}
