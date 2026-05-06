"use server";

import pool from './db';
import { type RowDataPacket } from 'mysql2';

// Reach Stats: Total Page Views and Unique Visitors
export async function getReachStats() {
  try {
    const [pvResult] = await pool.query<({ pv: number })[] & RowDataPacket[]>(
      `SELECT COUNT(*) as pv FROM analytics_views WHERE event_type = "pageview" AND page_path NOT LIKE '/admin%'`
    );
    const [uvResult] = await pool.query<({ uv: number })[] & RowDataPacket[]>(
      `SELECT COUNT(DISTINCT ip_hash) as uv FROM analytics_views WHERE page_path NOT LIKE '/admin%'`
    );
    
    return {
      pv: pvResult[0].pv || 0,
      uv: uvResult[0].uv || 0,
    };
  } catch (error) {
    console.error('[Analytics] Error getting reach stats:', error);
    return { pv: 0, uv: 0 };
  }
}

// Get Today's Stats
export async function getTodayStats() {
  try {
    const [pvResult] = await pool.query<({ pv: number })[] & RowDataPacket[]>(
      `SELECT COUNT(*) as pv FROM analytics_views WHERE event_type = "pageview" AND page_path NOT LIKE '/admin%' AND DATE(created_at) = CURDATE()`
    );
    const [uvResult] = await pool.query<({ uv: number })[] & RowDataPacket[]>(
      `SELECT COUNT(DISTINCT ip_hash) as uv FROM analytics_views WHERE page_path NOT LIKE '/admin%' AND DATE(created_at) = CURDATE()`
    );
    
    return {
      pv: pvResult[0].pv || 0,
      uv: uvResult[0].uv || 0,
    };
  } catch (error) {
    console.error('[Analytics] Error getting today stats:', error);
    return { pv: 0, uv: 0 };
  }
}

// Growth Stats: Top 10 Hero Builds
export async function getTopHeroBuilds() {
  try {
    const [rows] = await pool.query<({ page_path: string; views: number })[] & RowDataPacket[]>(
      `SELECT page_path, COUNT(*) as views 
       FROM analytics_views 
       WHERE page_path LIKE '/build/%' AND event_type = "pageview"
       GROUP BY page_path 
       ORDER BY views DESC 
       LIMIT 10`
    );
    return rows;
  } catch (error) {
    console.error('[Analytics] Error getting top hero builds:', error);
    return [];
  }
}

// Conversion Stats: Click Counts and CTR
export async function getClickStats() {
  try {
    const [totalClicksResult] = await pool.query<({ clicks: number })[] & RowDataPacket[]>(
      `SELECT COUNT(*) as clicks FROM analytics_clicks`
    );
    
    const [clicksByLinkResult] = await pool.query<({ link_url: string; link_id: string; clicks: number })[] & RowDataPacket[]>(
      `SELECT link_url, link_id, COUNT(*) as clicks 
       FROM analytics_clicks 
       GROUP BY link_url, link_id 
       ORDER BY clicks DESC`
    );

    // Calculate CTR globally 
    // Usually CTR = Clicks / Views (for pages that have the ad)
    // Here we'll do an overall rough estimation for pages where clicks occurred
    let ctr: string | number = 0;
    const [viewsResult] = await pool.query<({ views: number })[] & RowDataPacket[]>(
       `SELECT COUNT(*) as views FROM analytics_views WHERE event_type = "pageview" AND page_path NOT LIKE '/admin%'`
    );
    
    const totalViews = viewsResult[0].views;
    const totalClicks = totalClicksResult[0].clicks;

    if (totalViews > 0) {
      ctr = ((totalClicks / totalViews) * 100).toFixed(2);
    }

    return {
      totalClicks,
      ctr,
      clicksByLink: clicksByLinkResult
    };
  } catch (error) {
    console.error('[Analytics] Error getting click stats:', error);
    return { totalClicks: 0, ctr: 0, clicksByLink: [] };
  }
}

// Growth Stats: Top Exit Pages
export async function getExitPages() {
  try {
    // Find the last page_path for each session_id
    const [rows] = await pool.query<({ page_path: string; exits: number })[] & RowDataPacket[]>(`
      WITH RankedViews AS (
        SELECT session_id, page_path, 
               ROW_NUMBER() OVER(PARTITION BY session_id ORDER BY created_at DESC) as rn
        FROM analytics_views
        WHERE page_path NOT LIKE '/admin%'
      )
      SELECT page_path, COUNT(*) as exits
      FROM RankedViews
      WHERE rn = 1
      GROUP BY page_path
      ORDER BY exits DESC
      LIMIT 10
    `);
    
    return rows;
  } catch (error) {
    console.error('[Analytics] Error getting exit pages:', error);
    return [];
  }
}

// Custom Filtered Page Views with Pagination
export async function getFilteredPageViews(filters: { startDate?: string; endDate?: string; pagePath?: string; limit?: number; offset?: number }) {
  const { startDate, endDate, pagePath, limit = 100, offset = 0 } = filters || {};
  
  let countQuery = `SELECT COUNT(DISTINCT page_path) as total 
                    FROM analytics_views 
                    WHERE event_type = "pageview" AND page_path NOT LIKE '/admin%'`;
  
  let dataQuery = `SELECT page_path, COUNT(*) as views, COUNT(DISTINCT ip_hash) as unique_visitors 
                   FROM analytics_views 
                   WHERE event_type = "pageview" AND page_path NOT LIKE '/admin%'`;
  
  const params = [];
  const countParams = [];
  
  let whereClause = '';
  if (startDate) {
     whereClause += ` AND created_at >= ?`;
     params.push(`${startDate} 00:00:00`);
     countParams.push(`${startDate} 00:00:00`);
  }
  if (endDate) {
     whereClause += ` AND created_at <= ?`;
     params.push(`${endDate} 23:59:59`);
     countParams.push(`${endDate} 23:59:59`);
  }
  if (pagePath) {
     whereClause += ` AND page_path LIKE ?`;
     params.push(`%${pagePath}%`);
     countParams.push(`%${pagePath}%`);
  }
  
  dataQuery += whereClause + ` GROUP BY page_path ORDER BY views DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  
  countQuery += whereClause;
  
  try {
     const [rows] = await pool.query<({ page_path: string; views: number; unique_visitors: number })[] & RowDataPacket[]>(dataQuery, params);
     const [countResult] = await pool.query<({ total: number })[] & RowDataPacket[]>(countQuery, countParams);
     
     return {
        data: rows.map(r => ({ ...r })),
        total: countResult[0].total
     };
  } catch (error) {
     console.error('[Analytics] Error in getFilteredPageViews:', error);
     return { data: [], total: 0 };
  }
}

// New: View Trend Stats (Last 60 Days)
export async function getViewTrendData() {
  try {
    const [rows] = await pool.query<({ date: Date; views: number; visitors: number })[] & RowDataPacket[]>(`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as views,
        COUNT(DISTINCT ip_hash) as visitors
      FROM analytics_views
      WHERE event_type = "pageview" 
        AND page_path NOT LIKE '/admin%'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    return rows.map(r => ({
      date: r.date.toISOString().split('T')[0],
      views: r.views,
      visitors: r.visitors
    }));
  } catch (error) {
    console.error('[Analytics] Error getting trend data:', error);
    return [];
  }
}
