"use server"

import pool, { initDB } from './db'
import { getReachStats } from './analytics-actions'

export async function getDashboardStats() {
    await initDB()
    
    try {
        const [
            [buildCount],
            [raidCount],
            [crCount],
            [stageCount],
            [userCount]
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) as count FROM builds'),
            pool.query('SELECT COUNT(*) as count FROM raid_sets'),
            pool.query('SELECT COUNT(*) as count FROM castle_rush_sets'),
            pool.query('SELECT COUNT(*) as count FROM stage_setups'),
            pool.query('SELECT COUNT(*) as count FROM users')
        ])

        const reach = await getReachStats()

        return {
            builds: buildCount[0].count || 0,
            raidSets: raidCount[0].count || 0,
            castleRush: crCount[0].count || 0,
            stages: stageCount[0].count || 0,
            users: userCount[0].count || 0,
            views: reach.pv || 0,
            visitors: reach.uv || 0
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            builds: 0,
            raidSets: 0,
            castleRush: 0,
            stages: 0,
            users: 0,
            views: 0,
            visitors: 0
        }
    }
}
