import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function MainLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </>
    )
}
