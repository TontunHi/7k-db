"use client"

import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { login } from "@/lib/actions"
import { Shield, User, Lock, ArrowLeft, Loader2 } from "lucide-react"
import styles from "./login.module.css"

/**
 * SubmitButton - Separate component to use useFormStatus
 */
function SubmitButton() {
    const { pending } = useFormStatus()
    
    return (
        <button
            type="submit"
            disabled={pending}
            className={styles.submitBtn}
        >
            {pending ? (
                <>
                    <Loader2 className={styles.loadingSpinner} />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Shield size={18} />
                    <span>Authorize Login</span>
                    <div className={styles.btnGlow} />
                </>
            )}
        </button>
    )
}

/**
 * LoginPageView - Main UI Component for Login
 */
export default function LoginPageView() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")
    const prefillUser = searchParams.get("u") || "admin"

    return (
        <main className={styles.page}>
            {/* Cinematic Background */}
            <div className={styles.backgroundOverlay}>
                <Image 
                    src="/login_bg_tactical.png"
                    alt="Background"
                    fill
                    className={styles.backgroundImage}
                    priority
                />
                <div className={styles.backgroundTint} />
                <div className={styles.gridPattern} />
            </div>

            <div className={styles.loginCard}>
                <header className={styles.header}>
                    <div className={styles.badge}>Security Terminal</div>
                    <h1 className={styles.title}>
                        Access <span className={styles.titleSpan}>System</span>
                    </h1>
                    <p className={styles.subtitle}>Enter administrator credentials</p>
                </header>

                <form action={login} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <div className={styles.labelWrapper}>
                            <User size={12} className={styles.labelIcon} />
                            <label htmlFor="username" className={styles.label}>
                                Personnel ID
                            </label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Username"
                                defaultValue={prefillUser}
                                required
                                className={styles.input}
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <div className={styles.labelWrapper}>
                            <Lock size={12} className={styles.labelIcon} />
                            <label htmlFor="password" className={styles.label}>
                                Security Key
                            </label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className={styles.input}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <footer className={styles.footer}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Back to main database
                    </Link>
                </footer>
            </div>
        </main>
    )
}
