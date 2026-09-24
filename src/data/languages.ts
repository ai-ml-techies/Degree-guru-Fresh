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
