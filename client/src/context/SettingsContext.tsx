import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../types/video';
import { fetchCategories } from '../services/api';

export interface ApiSource {
  name: string;
  url: string;
}

interface SettingsContextType {
  sources: ApiSource[];
  currentSourceIndex: number;
  currentSource: ApiSource;
  categories: Category[];
  addSource: (source: ApiSource) => void;
  removeSource: (index: number) => void;
  setCurrentSourceIndex: (index: number) => void;
}

const defaultSources: ApiSource[] = (() => {
  const count = parseInt(import.meta.env.REEL_FLIEX_SOURCES_COUNT || '0', 10);
  const sources: ApiSource[] = [];
  
  for (let i = 1; i <= count; i++) {
    const name = import.meta.env[`REEL_FLIX_SOURCE_${i}_NAME`];
    const url = import.meta.env[`REEL_FLIX_SOURCE_${i}_URL`];
    if (name && url) {
      sources.push({ name, url });
    }
  }
  
  return sources;
})();

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<ApiSource[]>(() => {
    const saved = localStorage.getItem('reelFlix_sources');
    return saved ? JSON.parse(saved) : defaultSources;
  });

  const [currentSourceIndex, setCurrentSourceIndex] = useState<number>(() => {
    const saved = localStorage.getItem('reelFlix_currentSourceIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [categories, setCategories] = useState<Category[]>([]);

  const currentSource = sources[currentSourceIndex] || sources[0];

  useEffect(() => {
    localStorage.setItem('reelFlix_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('reelFlix_currentSourceIndex', currentSourceIndex.toString());
  }, [currentSourceIndex]);

  useEffect(() => {
    const fetchSourceCategories = async () => {
      if (!currentSource?.url) return;

      const cacheKey = `reelFlix_categories_${currentSource.url}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          setCategories(JSON.parse(cached));
          return;
        } catch (e) {
          console.error("Failed to parse cached categories", e);
          localStorage.removeItem(cacheKey);
        }
      }

      try {
        const res = await fetchCategories(currentSource.url);
        if (res.class) {
          setCategories(res.class);
          localStorage.setItem(cacheKey, JSON.stringify(res.class));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchSourceCategories();
  }, [currentSource]);

  const addSource = (source: ApiSource) => {
    setSources([...sources, source]);
  };

  const removeSource = (index: number) => {
    const newSources = sources.filter((_, i) => i !== index);
    setSources(newSources);
    if (currentSourceIndex >= index && currentSourceIndex > 0) {
      setCurrentSourceIndex(currentSourceIndex - 1);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      sources, 
      currentSourceIndex, 
      currentSource, 
      categories,
      addSource, 
      removeSource, 
      setCurrentSourceIndex 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
