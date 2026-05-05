import Link from "next/link"
import SafeImage from "@/components/shared/SafeImage"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 text-center font-sans">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#FFD700] blur-[100px] opacity-20"></div>
                <h1 className="relative text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-amber-600 italic transform -skew-x-12 select-none">
                    404
                </h1>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-4">
                Page Not Found
            </h2>
            
            <p className="text-gray-500 max-w-md mb-12 text-sm md:text-base font-light tracking-wide leading-relaxed">
                The content you are looking for has been moved, deleted, or never existed in the first place.
            </p>

            <Link 
                href="/" 
                className="group relative px-8 py-3 bg-[#FFD700] text-black font-black uppercase tracking-tighter italic transform -skew-x-12 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            >
                <span className="relative z-10 flex items-center gap-2">
                    Back to Home
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </Link>

            <div className="mt-24 opacity-10 grayscale pointer-events-none">
                <SafeImage 
                    src="/about_website/logo_website.webp" 
                    alt="Logo" 
                    width={200} 
                    height={60} 
                    style={{ height: 'auto' }}
                    className="object-contain"
                />
            </div>
        </div>
    )
}
