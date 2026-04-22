"use client"

import { useSearchParams } from "next/navigation"
import { useFormStatus } from "react-dom"
import { login } from "@/lib/actions"
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
                    <div className={styles.loadingSpinner} />
                    <span>Signing in...</span>
                </>
            ) : (
                "Login"
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
            <div className={styles.loginCard}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Admin <span className={styles.titleSpan}>Login</span>
                    </h1>
                    <p className={styles.subtitle}>Access Dashboard</p>
                </header>

                <form action={login} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="e.g. admin"
                            defaultValue={prefillUser}
                            required
                            className={styles.input}
                            autoComplete="username"
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className={styles.input}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </main>
    )
}
