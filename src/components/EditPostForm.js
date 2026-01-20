
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePost, uploadImage } from '@/lib/blog-actions';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPostForm({ post }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(post.title || '');
    const [slug, setSlug] = useState(post.slug || '');
    const [excerpt, setExcerpt] = useState(post.excerpt || '');
    const [content, setContent] = useState(post.content || '');
    const [coverImage, setCoverImage] = useState(post.cover_image || '');
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.set('title', title);
        formData.set('slug', slug);
        formData.set('excerpt', excerpt);
        formData.set('content', content);
        formData.set('cover_image', coverImage);

        const res = await updatePost(post.id, formData);
        if (res.success) {
            router.push('/admin/blog');
            router.refresh();
        } else {
            alert(res.error);
        }
        setLoading(false);
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadImage(formData);
        if (res.success) {
            setCoverImage(res.url);
        } else {
            alert('Upload failed: ' + res.error);
        }
        setUploading(false);
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Edit Post
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:outline-none transition-colors"
                            placeholder="Enter post title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug (Optional)</label>
                        <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full p-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:outline-none transition-colors"
                            placeholder="custom-url-slug"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Excerpt</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                        placeholder="Brief summary..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Cover Image</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                className="w-full p-3 rounded-lg bg-secondary/20 border border-border focus:border-primary focus:outline-none transition-colors pl-10"
                                placeholder="Image URL or Upload"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                🖼️
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                accept="image/*"
                            />
                            <button type="button" disabled={uploading} className="px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer">
                                {uploading ? 'Uploading...' : 'Upload New'}
                            </button>
                        </div>
                    </div>
                    {coverImage && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border mt-2 bg-black/20">
                            <img src={coverImage} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <div className="rounded-lg overflow-hidden border border-border text-foreground">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                </div>

                <div className="flex justify-end pt-4 gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
