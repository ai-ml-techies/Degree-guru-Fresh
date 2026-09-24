import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("dg_lang");
      return saved === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("dg_lang", lang);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("dg-lang-change", { detail: lang }));
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "dg_lang" && (e.newValue === "en" || e.newValue === "hi")) {
        setLanguageState(e.newValue);
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<Language>;
      if (custom.detail) {
        setLanguageState(custom.detail);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("dg-lang-change", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("dg-lang-change", handleCustom);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
