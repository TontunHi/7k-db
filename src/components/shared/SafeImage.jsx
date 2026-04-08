"use client"
import NextImage from "next/image"
import { useState, useEffect } from "react"

export default function SafeImage({ src, alt, fallback = "/heroes/placeholder.webp", ...props }) {
    const [hasError, setHasError] = useState(false)

    const imagePath = hasError || !src ? fallback : src

    return (
        <NextImage
            key={src}
            {...props}
            src={imagePath}
            alt={alt || "image"}
            onError={() => setHasError(true)}
        />
    )
}
