import HeroSection from '@/components/home/HeroSection'
import FeaturesGridPremium from '@/components/home/FeaturesGridPremium'
import BackgroundEffects from '@/components/home/BackgroundEffects'
import styles from '../page.module.css'

export const metadata = {
    title: 'Full UI Concept',
    description: 'A comprehensive preview of the new Text-First UI concept.',
};

export default function UIFullPage() {
    return (
        <div className={styles.page}>
            {/* Background Layer */}
            <BackgroundEffects />

            <div className={styles.container}>
                {/* Hero Header */}
                <HeroSection />

                <div className={styles.contentWrapper}>
                    <FeaturesGridPremium />
                </div>
            </div>
        </div>
    )
}
