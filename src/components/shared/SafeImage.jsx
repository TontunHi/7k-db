"use client"
import NextImage from "next/image"
import { useState, useEffect } from "react"

export default function SafeImage({ src, alt, fallback = "/heroes/placeholder.webp", ...props }) {
    const [hasError, setHasError] = useState(false)

    // Reset error state if src changes
    useEffect(() => {
        setHasError(false)
    }, [src])

    const imagePath = hasError || !src ? fallback : src

    return (
        <NextImage
            {...props}
            src={imagePath}
            alt={alt || "image"}
            onError={() => setHasError(true)}
        />
    )
}
