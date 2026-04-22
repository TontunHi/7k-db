import { getStages } from '@/lib/stage-actions'
import StagesManagerView from './StagesManagerView'

export const metadata = {
    title: 'Stage Management | Admin',
    description: 'Configure and maintain team recommendations for regular stages and nightmare modes.'
}

/**
 * AdminStagesPage - Server Component
 * Fetches stage and nightmare data from the database.
 */
export default async function AdminStagesPage() {
    // Fetch data in parallel for efficiency
    const [stages, nightmares] = await Promise.all([
        getStages('stage'),
        getStages('nightmare')
    ])

    return (
        <main>
            <StagesManagerView 
                stages={stages} 
                nightmares={nightmares} 
            />
        </main>
    )
}
