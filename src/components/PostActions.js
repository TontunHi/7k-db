
'use client'

import { deletePost } from '@/lib/blog-actions';
import { Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function PostActions({ id, slug }) {
    async function handleDelete() {
        if (confirm('Are you sure you want to delete this post?')) {
            await deletePost(id);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/blog/${slug}`}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                title="View"
                target="_blank"
            >
                👁️
            </Link>
            <Link
                href={`/admin/blog/edit/${id}`}
                className="p-2 text-muted-foreground hover:text-yellow-500 transition-colors"
                title="Edit"
            >
                <Pencil className="w-4 h-4" />
            </Link>
            <button
                onClick={handleDelete}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
