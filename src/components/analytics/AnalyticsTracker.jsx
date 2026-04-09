"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function generateSessionId() {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('analytics_sid');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('analytics_sid', sid);
  }
  return sid;
}

export function trackCustomPageView(path) {
  if (typeof window === 'undefined') return;
  const sid = generateSessionId();

  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'pageview',
      pagePath: path,
      sessionId: sid
    })
  }).catch(err => console.error('Analytics trackCustomPageView error', err));
}

export function trackOutboundClick(url, linkId = 'generic_link') {
  if (typeof window === 'undefined') return;
  const sid = generateSessionId();
  
  // Track click asynchronously
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'click',
      pagePath: window.location.pathname,
      sessionId: sid,
      url,
      linkId
    })
  }).catch(err => console.error('Analytics track error', err));
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    
    const sid = generateSessionId();

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        pagePath: pathname,
        sessionId: sid
      })
    }).catch(err => console.error('Analytics pageview error', err));

  }, [pathname, searchParams]);

  return null;
}
