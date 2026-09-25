export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  group: "preferred" | "indian" | "global";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Top 2 Preferred
  { code: "en", name: "English", nativeName: "English", group: "preferred" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", group: "preferred" },

  // Indian Regional Languages
  { code: "bn", name: "Bengali", nativeName: "বাংলা", group: "indian" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", group: "indian" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", group: "indian" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", group: "indian" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", group: "indian" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", group: "indian" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", group: "indian" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", group: "indian" },
  { code: "ur", name: "Urdu", nativeName: "اردو", group: "indian" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", group: "indian" },

  // Global Languages
  { code: "es", name: "Spanish", nativeName: "Español", group: "global" },
  { code: "fr", name: "French", nativeName: "Français", group: "global" },
  { code: "de", name: "German", nativeName: "Deutsch", group: "global" },
  { code: "ar", name: "Arabic", nativeName: "العربية", group: "global" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", group: "global" },
];
