export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  shortPreview: string;
  group: "preferred" | "indian" | "global";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Top 2 Preferred
  { code: "en", name: "English", nativeName: "English", shortPreview: "EN", group: "preferred" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", shortPreview: "हि", group: "preferred" },

  // Indian Regional Languages
  { code: "bn", name: "Bengali", nativeName: "বাংলা", shortPreview: "বা", group: "indian" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", shortPreview: "म", group: "indian" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", shortPreview: "తె", group: "indian" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", shortPreview: "த", group: "indian" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", shortPreview: "ગુ", group: "indian" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", shortPreview: "ಕ", group: "indian" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", shortPreview: "മ", group: "indian" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", shortPreview: "ਪੰ", group: "indian" },
  { code: "ur", name: "Urdu", nativeName: "اردو", shortPreview: "اردو", group: "indian" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", shortPreview: "ଓ", group: "indian" },

  // Global Languages
  { code: "es", name: "Spanish", nativeName: "Español", shortPreview: "ES", group: "global" },
  { code: "fr", name: "French", nativeName: "Français", shortPreview: "FR", group: "global" },
  { code: "de", name: "German", nativeName: "Deutsch", shortPreview: "DE", group: "global" },
  { code: "ar", name: "Arabic", nativeName: "العربية", shortPreview: "ع", group: "global" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", shortPreview: "ID", group: "global" },
];
