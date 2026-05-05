import { getGuildWarTeams } from '@/lib/guild-war-actions'
import GuildWarView from '@/components/guild-war/GuildWarView'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { getLastUpdate } from '@/lib/log-actions'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Guild War Teams - 7Knights DB',
    description: 'Optimize your Guild War setups with specialized 3-hero formations, equipment guides, and counter strategies.'
}

export default async function GuildWarPage() {
    // Fetch unified teams list
    const [teams, heroImageMap, lastUpdated] = await Promise.all([
        getGuildWarTeams('all'),
        getHeroImageMap(),
        getLastUpdate('GUILD_WAR')
    ])
    
    return (
        <GuildWarView 
            teams={teams} 
            heroImageMap={heroImageMap} 
            lastUpdated={lastUpdated}
        />
    )
}
