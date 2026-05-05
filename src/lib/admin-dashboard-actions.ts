"use server"

import pool, { initDB } from './db'
import { getReachStats } from './analytics-actions'
import { type RowDataPacket } from 'mysql2'

export interface DashboardStats {
    builds: number;
    raidSets: number;
    castleRush: number;
    stages: number;
    users: number;
    views: number;
    visitors: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    await initDB()
    
    try {
        const [
            [buildRows],
            [raidRows],
            [crRows],
            [stageRows],
            [userRows]
        ] = await Promise.all([
            pool.query<({ count: number })[] & RowDataPacket[]>("SELECT COUNT(*) as count FROM builds"),
            pool.query<({ count: number })[] & RowDataPacket[]>("SELECT COUNT(*) as count FROM raid_sets"),
            pool.query<({ count: number })[] & RowDataPacket[]>("SELECT COUNT(*) as count FROM castle_rush_sets"),
            pool.query<({ count: number })[] & RowDataPacket[]>("SELECT COUNT(*) as count FROM stage_setups"),
            pool.query<({ count: number })[] & RowDataPacket[]>("SELECT COUNT(*) as count FROM users")
        ])

        const reach = await getReachStats()

        return {
            builds: buildRows[0]?.count || 0,
            raidSets: raidRows[0]?.count || 0,
            castleRush: crRows[0]?.count || 0,
            stages: stageRows[0]?.count || 0,
            users: userRows[0]?.count || 0,
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
