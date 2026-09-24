import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES, LanguageOption } from "@/data/languages";

export type { LanguageOption };

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
  currentLanguage: SUPPORTED_LANGUAGES[1], // English
});

// Safe on-demand helper to translate page if user selects a non-English language
const applyTranslationSafely = (lang: string) => {
  if (typeof window === "undefined") return;
  try {
    const cookieVal = lang === "en" ? "/en/en" : `/en/${lang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;

    // If Google Translate combo already exists in the document, trigger it
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
  } catch {
    // Fail silently so the UI never breaks
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("dg_lang");
      return saved || "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("dg_lang", lang);
    } catch {
      // ignore
    }
    applyTranslationSafely(lang);
    window.dispatchEvent(new CustomEvent("dg-lang-change", { detail: lang }));
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "dg_lang" && e.newValue) {
        setLanguageState(e.newValue);
        applyTranslationSafely(e.newValue);
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setLanguageState(custom.detail);
        applyTranslationSafely(custom.detail);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("dg-lang-change", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("dg-lang-change", handleCustom);
    };
  }, []);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[1];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        languages: SUPPORTED_LANGUAGES,
        currentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
