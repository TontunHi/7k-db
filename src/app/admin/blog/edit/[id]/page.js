
import { getPostById } from '@/lib/blog-actions';
import EditPostForm from '@/components/EditPostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    return <EditPostForm post={post} />;
}
