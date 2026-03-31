import { getGuildWarTeams } from '@/lib/guild-war-actions'
import GuildWarView from '@/components/guild-war/GuildWarView'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Guild War Teams - 7Knights DB',
    description: 'Optimize your Guild War Attacker and Defender setups with the best 3-hero formations.'
}

export default async function GuildWarPage() {
    // Fetch both simultaneously
    const [attackers, defenders] = await Promise.all([
        getGuildWarTeams('attacker'),
        getGuildWarTeams('defender')
    ])
    
    // Parse heroes JSON for both
    const parseSet = set => ({
        ...set,
        heroes: typeof set.heroes_json === 'string' 
            ? JSON.parse(set.heroes_json) 
            : (set.heroes_json || set.heroes || []),
        skill_rotation: typeof set.skill_rotation === 'string'
            ? JSON.parse(set.skill_rotation)
            : (set.skill_rotation || [])
    })

    const parsedAttackers = attackers.map(parseSet)
    const parsedDefenders = defenders.map(parseSet)

    return (
        <GuildWarView attackers={parsedAttackers} defenders={parsedDefenders} />
    )
}
