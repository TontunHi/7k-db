
'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import Image from 'next/image';

export default function LatestPost({ post }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-8 md:p-12 shadow-2xl transition-all duration-500">
            {post.cover_image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 shadow-lg border border-border/50">
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}

            <header className="mb-8 text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Content Toggler */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="group flex items-center gap-2 px-8 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all hover:scale-105 active:scale-95"
                >
                    {isExpanded ? (
                        <>
                            <span>Collapse Article</span>
                            <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        </>
                    ) : (
                        <>
                            <span>Read Full Article</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
                    <div
                        className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="flex justify-center mt-12 pt-8 border-t border-border">
                        <button
                            onClick={() => {
                                setIsExpanded(false);
                                // Optional: scroll back to top of article
                                const articleTop = document.querySelector('article');
                                if (articleTop) articleTop.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Close Article
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
