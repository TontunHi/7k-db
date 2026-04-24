import HeroSection from '@/components/home/HeroSection'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import UpdateSidebar from '@/components/home/UpdateSidebar'
import BackgroundEffects from '@/components/home/BackgroundEffects'
import styles from './page.module.css'

export const revalidate = 60;

export const metadata = {
    title: 'Home',
    description: 'Welcome to the ultimate Seven Knights Rebirth database. Find hero builds, tier lists, and complete stage guides.',
};

export default async function HomePage() {
    return (
        <div className={styles.page}>
            {/* Background Layer */}
            <BackgroundEffects />

            <div className={styles.container}>
                {/* Hero Header */}
                <HeroSection />

                <div className={styles.contentWrapper}>
                    <FeaturesGrid />
                </div>
            </div>
        </div>
    )
}
