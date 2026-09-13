import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

/**
 * Component that triggers AdSense auto-ads & page-level ad refresh on React SPA route changes.
 * This ensures Google AdSense tags every dynamic page navigation (as required by AdSense guidelines).
 */
export const AdSenseAutoAds = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: 'ca-pub-2125114496532619',
          enable_page_level_ads: true
        });
      }
    } catch (e) {
      // Safe catch for ad-blockers or duplicate pushes
    }
  }, [location.pathname]);

  return null;
};
