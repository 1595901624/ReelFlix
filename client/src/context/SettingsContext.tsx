import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ApiSource {
  name: string;
  url: string;
}

interface SettingsContextType {
  sources: ApiSource[];
  currentSourceIndex: number;
  currentSource: ApiSource;
  addSource: (source: ApiSource) => void;
  removeSource: (index: number) => void;
  setCurrentSourceIndex: (index: number) => void;
}

const defaultSources: ApiSource[] = [
  { name: '默认源 (JS资源)', url: 'https://jszyapi.com/api.php/provide/vod/' }
];

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

  useEffect(() => {
    localStorage.setItem('reelFlix_sources', JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem('reelFlix_currentSourceIndex', currentSourceIndex.toString());
  }, [currentSourceIndex]);

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

  const currentSource = sources[currentSourceIndex] || sources[0];

  return (
    <SettingsContext.Provider value={{ 
      sources, 
      currentSourceIndex, 
      currentSource, 
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
