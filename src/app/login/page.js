"use client"

import { login } from "@/lib/actions"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
// import { useFormStatus } from "react-dom" // Optional for loading state

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <div className="w-full max-w-sm p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold italic uppercase tracking-tight text-[#FFD700]">Admin <span className="text-white">Login</span></h1>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-2 ml-1 opacity-50">Access Dashboard</p>
            </div>

            <form action={login} className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-1.5 pl-1">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="e.g. admin"
                            defaultValue="admin"
                            required
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-800 focus:outline-none focus:border-[#FFD700] transition-colors"
                        />
                    </div>
                    
                    <div className="space-y-1.5 pl-1">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-800 focus:outline-none focus:border-[#FFD700] transition-colors"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center tracking-widest leading-relaxed">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold py-3 rounded-lg transition-colors cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Suspense fallback={<div className="text-[#FFD700]">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    )
}
