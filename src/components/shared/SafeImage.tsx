"use client"
import NextImage from "next/image"
import { useState, useEffect } from "react"

export default function SafeImage({ src, alt, fallback = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", ...props }) {
    const [hasError, setHasError] = useState(false)

    // Ensure we don't have double extensions like .webp.webp
    const cleanSrc = (path) => {
        if (!path) return path
        // If it already has an extension, keep it. If it has double, strip one.
        // Actually, just ensure it ends with .webp if it's an image path we manage
        if (path.includes('.webp.webp')) return path.replace('.webp.webp', '.webp')
        return path
    }

    const finalSrc = cleanSrc(src)
    const imagePath = hasError || !finalSrc ? fallback : finalSrc

    // Handle 'fill' specific props
    const fillProps = props.fill ? {
        sizes: props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    } : {}

    // Handle aspect ratio warning: if width or height is provided, ensure the other is auto via style
    const styleProps = {
        ...props.style,
        ...(props.width && !props.height ? { height: 'auto' } : {}),
        ...(props.height && !props.width ? { width: 'auto' } : {}),
    }

    // Check if the image source points to small game asset directories (large assets like heroes and pets should be optimized)
    const isGameAsset = finalSrc && (
        finalSrc.includes('/items/') || 
        finalSrc.includes('/skills/')
    )

    return (
        <NextImage
            key={finalSrc}
            {...props}
            {...fillProps}
            unoptimized={props.unoptimized !== undefined ? props.unoptimized : isGameAsset}
            style={styleProps}
            src={imagePath}
            alt={alt || "image"}
            onError={() => setHasError(true)}
        />
    )
}
