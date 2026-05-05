import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';
import { getAdminUser } from '@/lib/auth-guard';

function hashIpAddress(ip) {
  const salt = process.env.ANALYTICS_SALT || '7k-tracker-secret';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, pagePath, sessionId, url, linkId } = body;

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    // Get User Agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    const ipHash = hashIpAddress(ip);

    // Ensure session_id and page_path exist
    if (!sessionId || !pagePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // SKIP TRACKING FOR ADMINS OR ADMIN PATHS
    if (pagePath.startsWith('/admin')) {
      return NextResponse.json({ success: true, message: 'Admin path ignored' });
    }

    const adminUser = await getAdminUser();
    if (adminUser) {
      return NextResponse.json({ success: true, message: 'Admin user ignored' });
    }

    if (type === 'pageview') {
      await pool.query(
        `INSERT INTO analytics_views (page_path, ip_hash, session_id, user_agent, event_type) VALUES (?, ?, ?, ?, ?)`,
        [pagePath, ipHash, sessionId, userAgent, 'pageview']
      );
    } else if (type === 'click') {
      if (!url) {
        return NextResponse.json({ error: 'Missing url for click event' }, { status: 400 });
      }
      await pool.query(
        `INSERT INTO analytics_clicks (link_url, link_id, page_path, ip_hash, session_id) VALUES (?, ?, ?, ?, ?)`,
        [url, linkId || null, pagePath, ipHash, sessionId]
      );
      return NextResponse.json({ success: true, redirect: url });
    } else {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics API] Error tracking event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
