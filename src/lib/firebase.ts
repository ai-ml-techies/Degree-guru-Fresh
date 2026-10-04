import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2NDlo3tOkJZjM9aYynZgkoJVdwgcGK-k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "degree-guru.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "degree-guru",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "degree-guru.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "861267274283",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:861267274283:web:e32c0db982388d4ae8586e",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

export const getFirebaseAuth = (): Auth | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  if (!auth && app) {
    auth = getAuth(app);
    auth.useDeviceLanguage();
  }
  return auth;
};

export const clearExistingRecaptcha = (containerId: string) => {
  if (typeof window !== "undefined") {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch {
        // ignore
      }
      (window as any).recaptchaVerifier = null;
    }
    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = "";
    }
  }
};

export const createRecaptchaVerifier = (
  containerId: string,
  callback?: () => void
): RecaptchaVerifier | null => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) return null;

  try {
    clearExistingRecaptcha(containerId);

    const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
      size: "invisible",
      callback: () => {
        if (callback) callback();
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired, resetting...");
        clearExistingRecaptcha(containerId);
      },
    });

    if (typeof window !== "undefined") {
      (window as any).recaptchaVerifier = verifier;
    }

    return verifier;
  } catch (err) {
    console.error("Error creating RecaptchaVerifier:", err);
    return null;
  }
};

export const sendPhoneOtp = async (
  rawPhoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error("Firebase Authentication is not configured.");
  }

  // Ensure format +91XXXXXXXXXX
  const cleanDigits = rawPhoneNumber.replace(/\D/g, "");
  const formattedNumber = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

  return await signInWithPhoneNumber(firebaseAuth, formattedNumber, verifier);
};

export type { ConfirmationResult };
