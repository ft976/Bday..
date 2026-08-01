import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultSiteData } from '../lib/defaultData';

const SiteDataContext = createContext<any>(null);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(defaultSiteData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siteData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({ ...defaultSiteData, ...parsed });
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);

    const fetchLiveSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const liveData = await response.json();
          setData(liveData);
          localStorage.setItem('siteData', JSON.stringify(liveData));
        }
      } catch (err) {
        // Silently fallback to cached/defaults
      }
    };

    fetchLiveSettings();

    const interval = setInterval(() => {
      fetchLiveSettings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateData = async (newData: any) => {
    setData(newData);
    try {
      localStorage.setItem('siteData', JSON.stringify(newData));
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newData })
      });
      
      const result = await response.json();
      if (result.success) {
        return { success: true };
      } else {
        alert('Failed to save globally: ' + (result.error || 'Unknown error'));
        return { success: false, error: result.error };
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
