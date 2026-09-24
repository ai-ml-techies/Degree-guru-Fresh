import React, { createContext, useContext, useState, useEffect } from "react";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  group: "preferred" | "indian" | "global";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Top 2 Preferred
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", group: "preferred" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", group: "preferred" },

  // Indian Regional Languages
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", group: "indian" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", group: "indian" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", group: "indian" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", group: "indian" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", group: "indian" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", group: "indian" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", group: "indian" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", group: "indian" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳", group: "indian" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", group: "indian" },

  // Global Languages
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", group: "global" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", group: "global" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", group: "global" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪", group: "global" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", group: "global" },
];

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

const applyGoogleTranslate = (lang: string) => {
  if (typeof window === "undefined") return;
  try {
    const hostname = window.location.hostname;
    const cookieVal = lang === "en" ? "/en/en" : `/en/${lang}`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;

    // Attempt to set select box if already present in DOM
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
  } catch (err) {
    console.error("Google translate apply error:", err);
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
    applyGoogleTranslate(lang);
    window.dispatchEvent(new CustomEvent("dg-lang-change", { detail: lang }));
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  useEffect(() => {
    // Apply saved language on mount
    if (language && language !== "en") {
      setTimeout(() => applyGoogleTranslate(language), 500);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "dg_lang" && e.newValue) {
        setLanguageState(e.newValue);
        applyGoogleTranslate(e.newValue);
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setLanguageState(custom.detail);
        applyGoogleTranslate(custom.detail);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("dg-lang-change", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("dg-lang-change", handleCustom);
    };
  }, [language]);

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
