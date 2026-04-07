"use client"
import NextImage from "next/image"
import { useState } from "react"

export default function SafeImage({ src, alt, fallback = "/heroes/placeholder.webp", ...props }) {
    const [imgSrc, setImgSrc] = useState(src)
    const [hasError, setHasError] = useState(false)

    return hasError ? (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-800 rounded-sm">
            <span className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">No Image</span>
        </div>
    ) : (
        <NextImage
            {...props}
            src={imgSrc || fallback}
            alt={alt || "image"}
            onError={() => setHasError(true)}
        />
    )
}
