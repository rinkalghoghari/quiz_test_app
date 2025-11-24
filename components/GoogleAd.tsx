import React, { useEffect, useState } from 'react';
import { getRemoteConfigValue } from '@/lib/firebaseConfig';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

// Define the props interface for type safety
interface GoogleAdProps {
  // The ad slot ID from Google AdSense
  adSlot?: string;
  // Optional custom class name for styling
  className?: string;
  // Optional style object for inline styling
  style?: React.CSSProperties;
}

/**
 * GoogleAd Component
 * A reusable component for displaying Google AdSense advertisements
 * 
 * Features:
 * - Responsive ad container
 * - Error handling for ad loading
 * - TypeScript support
 * - Customizable through props
 */
const GoogleAd: React.FC<GoogleAdProps> = ({ 
  adSlot: propAdSlot = '',
  className = '',
  style = {}
}) => {
  const [adSlot, setAdSlot] = useState(propAdSlot);
  const [adEnabled, setAdEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check GDPR consent
    const gdprConsent = localStorage.getItem('gdpr-consent');
    if (gdprConsent === 'false') {
      setAdEnabled(false);
      return;
    }

    // Get ad slot from Remote Config if not provided as prop
    if (!propAdSlot) {
      const remoteAdSlot = getRemoteConfigValue('slotId');
      if (remoteAdSlot) {
        console.log('Remote ad slot:', remoteAdSlot);
        setAdSlot(remoteAdSlot);
      }
    }

    // Check if ads are enabled in Remote Config
    const isAdEnabled = gdprConsent === 'true' && getRemoteConfigValue('google_ad_enabled') !== 'false';
    setAdEnabled(isAdEnabled);
  }, [propAdSlot]);
  useEffect(() => {
    try {
      // Initialize the adsbygoogle array if it doesn't exist
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Demo styles - these will be shown in development
  const demoStyles: React.CSSProperties = {
    margin: '20px 0',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    border: '2px dashed #dee2e6',
    borderRadius: '8px',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: '#6c757d',
    ...style // Merge with any custom styles passed as props
  };

  // Don't render anything if still loading or if ads are disabled
  if (adEnabled === null) {
    return null; // Or a loading state if you prefer
  }
  
  if (!adEnabled) {
    return null;
  }

  // If no ad slot is set, show a warning
  if (!adSlot) {
    return (
      <div className={`google-ad ${className}`} style={demoStyles}>
        <div style={{ color: 'red', textAlign: 'center' }}>
          Ad slot not configured. Please set up Firebase Remote Config with google_ad_slot.
        </div>
      </div>
    );
  }

  return (
    <div className={`google-ad ${className}`} style={demoStyles}>
      {/* Demo content - will be replaced with actual ad in production */}
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Advertisement - Slot: {adSlot}
      </div>
      
      {/* Actual AdSense Ad */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISH ER_ID"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>
  );
};

export default GoogleAd;
