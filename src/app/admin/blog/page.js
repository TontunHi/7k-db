import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/blog-actions';
import { format } from 'date-fns';
import PostActions from '@/components/PostActions';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const { posts } = await getPosts(1, 100);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Blog Posts
                </h1>
                <Link
                    href="/admin/blog/create"
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    + Create New
                </Link>
            </div>

            <div className="grid gap-4">
                {posts.map(post => (
                    <div key={post.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            {post.cover_image && (
                                <div className="relative w-16 h-16 rounded overflow-hidden bg-secondary/20 shrink-0">
                                    <Image src={post.cover_image} alt="" fill className="object-cover" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{post.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                    Published on {format(new Date(post.created_at), 'MMM d, yyyy')} • /{post.slug}
                                </div>
                            </div>
                        </div>
                        <PostActions id={post.id} slug={post.slug} />
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No posts found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
