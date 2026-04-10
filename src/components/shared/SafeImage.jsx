"use client"
import NextImage from "next/image"
import { useState, useEffect } from "react"

export default function SafeImage({ src, alt, fallback = "/heroes/placeholder.webp", ...props }) {
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

    return (
        <NextImage
            key={finalSrc}
            {...props}
            {...fillProps}
            style={styleProps}
            src={imagePath}
            alt={alt || "image"}
            onError={() => setHasError(true)}
        />
    )
}
