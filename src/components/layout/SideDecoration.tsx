"use client"

import Image from "next/image"

export default function SideDecoration() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none">
            {/* Left Decoration */}
            <div 
                className="absolute left-0 top-0 bottom-0 hidden 2xl:block w-[calc((100vw-1280px)/2)] max-w-[400px]"
                style={{
                    maskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
                }}
            >
                <div className="relative w-full h-full opacity-60 dark:opacity-80">
                    <Image
                        src="/about_website/left.jpg"
                        alt=""
                        fill
                        className="object-cover object-right"
                        priority
                    />
                </div>
            </div>

            {/* Right Decoration */}
            <div 
                className="absolute right-0 top-0 bottom-0 hidden 2xl:block w-[calc((100vw-1280px)/2)] max-w-[400px]"
                style={{
                    maskImage: 'linear-gradient(to left, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, black 70%, transparent 100%)'
                }}
            >
                <div className="relative w-full h-full opacity-60 dark:opacity-80">
                    <Image
                        src="/about_website/right.jpg"
                        alt=""
                        fill
                        className="object-cover object-left"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
