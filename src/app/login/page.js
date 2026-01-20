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
                <h1 className="text-2xl font-bold text-[#FFD700]">Admin Login</h1>
                <p className="text-sm text-gray-400 mt-2">Enter password to access dashboard</p>
            </div>

            <form action={login} className="space-y-4">
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
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
