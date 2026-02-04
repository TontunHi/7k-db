
'use server'

import pool from './db';
import slugify from 'slugify';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function getPosts(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
        'SELECT id, title, slug, content, excerpt, cover_image, created_at FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM posts');
    const total = countResult[0].total;

    return {
        posts: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function getPostBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM posts WHERE slug = ?', [slug]);
    return rows[0];
}

export async function getPostById(id) {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
}

export async function createPost(formData) {
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt');
    const cover_image = formData.get('cover_image');

    let slug = formData.get('slug');
    if (!slug) {
        slug = slugify(title, { lower: true, strict: true });
    }

    // Ensure unique slug
    const [existing] = await pool.query('SELECT id FROM posts WHERE slug = ?', [slug]);
    if (existing.length > 0) {
        slug = `${slug}-${Date.now()}`;
    }

    try {
        await pool.query(
            'INSERT INTO posts (title, slug, content, excerpt, cover_image) VALUES (?, ?, ?, ?, ?)',
            [title, slug, content, excerpt, cover_image]
        );
        revalidatePath('/');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error) {
        console.error('Create Post Error:', error);
        return { success: false, error: error.message };
    }
}

export async function updatePost(id, formData) {
    const title = formData.get('title');
    const content = formData.get('content');
    const excerpt = formData.get('excerpt');
    const cover_image = formData.get('cover_image');
    // Slug update is tricky, allow if needed but cautious
    const slug = formData.get('slug');

    try {
        if (slug) {
            await pool.query(
                'UPDATE posts SET title = ?, slug = ?, content = ?, excerpt = ?, cover_image = ? WHERE id = ?',
                [title, slug, content, excerpt, cover_image, id]
            );
        } else {
            await pool.query(
                'UPDATE posts SET title = ?, content = ?, excerpt = ?, cover_image = ? WHERE id = ?',
                [title, content, excerpt, cover_image, id]
            );
        }

        revalidatePath('/');
        revalidatePath('/admin/blog');
        if (slug) revalidatePath(`/blog/${slug}`);

        return { success: true };
    } catch (error) {
        console.error('Update Post Error:', error);
        return { success: false, error: error.message };
    }
}

export async function deletePost(id) {
    try {
        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        revalidatePath('/');
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function uploadImage(formData) {
    const file = formData.get('file');
    if (!file) {
        return { success: false, error: 'No file uploaded' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        return { success: true, url: `/uploads/${filename}` };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
    }
}
