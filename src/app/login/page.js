import { Suspense } from "react"
import LoginPageView from "./LoginPageView"

export const metadata = {
    title: "Admin Login | 7K DB",
    description: "Secure login to the Seven Knights Rebirth Database administrator dashboard.",
    robots: {
        index: false,
        follow: false,
    }
}

/**
 * LoginPage - Entry point for the login route.
 * Wrapped in Suspense to handle useSearchParams in LoginPageView.
 */
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center',
                backgroundColor: 'var(--background)',
                color: 'var(--primary)'
            }}>
                Loading Authentication...
            </div>
        }>
            <LoginPageView />
        </Suspense>
    )
}
