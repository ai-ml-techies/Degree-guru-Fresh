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
  currentLanguage: SUPPORTED_LANGUAGES[0], // English
});

// Safe on-demand helper to translate entire website when user selects Hindi or another language
const applyTranslationSafely = (lang: string) => {
  if (typeof window === "undefined") return;
  try {
    const host = window.location.hostname;
    const cookieVal = lang === "en" ? "/en/en" : `/en/${lang}`;

    // Set cookie for path=/ and domains
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (host && host !== "localhost") {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=.${host};`;
    }

    if (lang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=/en/en; path=/;";
      if (host && host !== "localhost") {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
        document.cookie = `googtrans=/en/en; path=/; domain=${host};`;
      }
    }

    // If Google Translate combo already exists in the document, trigger it
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      if (lang === "en") {
        setTimeout(() => {
          window.location.reload();
        }, 150);
      }
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 100);
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

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      if (language === "hi") {
        document.body.classList.add("hi-lang");
      } else {
        document.body.classList.remove("hi-lang");
      }
    }
  }, [language]);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

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
