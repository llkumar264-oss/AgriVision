'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, Translations, TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('agrivision_language') as AppLanguage;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'hinglish')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrivision_language', newLang);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
