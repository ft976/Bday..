import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultSiteData } from '../lib/defaultData';
import { decodeConfigFromUrl } from '../lib/shareUtils';

const SiteDataContext = createContext<any>(null);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(defaultSiteData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check if config parameter exists in URL
    let urlConfig: any = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cfgParam = urlParams.get('cfg');
      if (cfgParam) {
        urlConfig = decodeConfigFromUrl(cfgParam);
      }
    }

    if (urlConfig) {
      // If shared via URL, prioritize encoded URL parameters
      setData(prev => ({
        ...defaultSiteData,
        ...urlConfig,
        hero: { ...defaultSiteData.hero, ...(urlConfig.hero || {}) },
        reasons: { ...defaultSiteData.reasons, ...(urlConfig.reasons || {}) },
        letter: { ...defaultSiteData.letter, ...(urlConfig.letter || {}) },
        music: { ...defaultSiteData.music, ...(urlConfig.music || {}) },
        gallery: urlConfig.gallery || defaultSiteData.gallery
      }));
    } else {
      // 2. Otherwise load from localStorage
      try {
        const stored = localStorage.getItem('siteData');
        if (stored) {
          const parsed = JSON.parse(stored);
          setData({ ...defaultSiteData, ...parsed });
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoaded(true);

    const fetchLiveSettings = async () => {
      // Only poll backend if not overriding with explicit URL config
      if (urlConfig) return;

      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const liveData = await response.json();
          if (liveData && !liveData.empty && typeof liveData === 'object' && liveData.hero) {
            const merged = { ...defaultSiteData, ...liveData };
            setData(merged);
            try {
              localStorage.setItem('siteData', JSON.stringify(merged));
            } catch (e) {}
          }
        }
      } catch (err) {
        // Silently fallback
      }
    };

    fetchLiveSettings();

    const interval = setInterval(() => {
      fetchLiveSettings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateData = async (newData: any) => {
    const merged = { ...defaultSiteData, ...newData };
    setData(merged);
    try {
      localStorage.setItem('siteData', JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: merged })
      });
      
      const result = await response.json();
      if (result && result.success) {
        return { success: true };
      } else {
        console.warn('Server update warning:', result?.error);
        return { success: true };
      }
    } catch (err) {
      return { success: true };
    }
  };

  if (!isLoaded) return null;

  return (
    <SiteDataContext.Provider value={{ data, updateData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export const useSiteData = () => useContext(SiteDataContext);
