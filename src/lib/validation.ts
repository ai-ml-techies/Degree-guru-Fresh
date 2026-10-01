/**
 * Comprehensive Validation Utilities for Degree Guru
 * 
 * Rules Enforced:
 * 1. Indian Phone Numbers:
 *    - Must be 10 digits (ignoring +91, 91, or leading 0).
 *    - Indian numbers NEVER start with 0, 1, 2, 3, 4, or 5.
 *    - Must start strictly with 6, 7, 8, or 9.
 *    - Rejects repetitive numbers (e.g., 9999999999) and sequential dummy numbers (e.g., 9876543210, 1234567890).
 * 
 * 2. Meaningful Name Validation:
 *    - Rejects keyboard mashes (e.g., "dafklahslf", "asdfghjkl", "qwerty").
 *    - Rejects home-row mashes and consonant clusters without vowels.
 *    - Rejects repetitive characters (e.g., "aaaaa", "zzzz").
 *    - Rejects placeholder/dummy names ("test", "dummy", "admin", "fake", "xyz", "abc").
 *    - Requires at least 2 characters, valid alphabetic script, and vowels in words.
 * 
 * 3. Meaningful Email Validation:
 *    - RFC compliant format.
 *    - Blocks disposable/temporary domains (mailinator, 10minutemail, tempmail, guerrillamail, yopmail, etc.).
 *    - Blocks dummy/test domains (example.com, test.com, fake.com, dummy.com, sample.com, asdf.com).
 *    - Blocks dummy/mash usernames (test@, admin@, asdf@, 123@, repetitive characters).
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

// -------------------------------------------------------------
// 1. INDIAN MOBILE NUMBER VALIDATION
// -------------------------------------------------------------
export function validateIndianMobile(rawInput: string): ValidationResult {
  if (!rawInput || typeof rawInput !== "string") {
    return { valid: false, error: "Please enter your mobile number." };
  }

  const digits = rawInput.replace(/\D/g, "");

  if (digits.length === 0) {
    return { valid: false, error: "Please enter your mobile number." };
  }

  // Handle prefix (+91 or 91 with 12 digits, or leading 0 with 11 digits)
  let clean10 = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    clean10 = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    clean10 = digits.slice(1);
  }

  if (clean10.length < 10) {
    return {
      valid: false,
      error: `Please enter a complete 10-digit mobile number (${10 - clean10.length} digit${10 - clean10.length === 1 ? "" : "s"} remaining).`,
    };
  }

  if (clean10.length > 10) {
    return {
      valid: false,
      error: "Indian mobile numbers must be exactly 10 digits.",
    };
  }

  const firstDigit = clean10.charAt(0);

  // In India, mobile numbers only start with 6, 7, 8, or 9
  if (["0", "1", "2", "3", "4", "5"].includes(firstDigit)) {
    return {
      valid: false,
      error: `Indian mobile numbers cannot start with '${firstDigit}'. They must start with 6, 7, 8, or 9.`,
    };
  }

  if (!/^[6-9]\d{9}$/.test(clean10)) {
    return {
      valid: false,
      error: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
    };
  }

  // Reject all identical digits: 9999999999, 8888888888, 7777777777, 6666666666
  if (/^(\d)\1{9}$/.test(clean10)) {
    return {
      valid: false,
      error: "Please enter a genuine mobile number, not repeated digits.",
    };
  }

  // Reject obvious sequential / test numbers
  const dummyNumbers = [
    "9876543210",
    "9876543211",
    "9876543212",
    "8765432109",
    "7890123456",
    "6789012345",
    "9898989898",
    "9797979797",
    "9191919191",
    "9090909090",
  ];
  if (dummyNumbers.includes(clean10)) {
    return {
      valid: false,
      error: "Please enter a genuine mobile number, not a dummy or test sequence.",
    };
  }

  return { valid: true, normalized: clean10 };
}

// -------------------------------------------------------------
// 2. MEANINGFUL FULL NAME VALIDATION
// -------------------------------------------------------------
const DUMMY_NAMES = new Set([
  "test",
  "testing",
  "tester",
  "dummy",
  "admin",
  "administrator",
  "fake",
  "fakename",
  "sample",
  "user",
  "guest",
  "someone",
  "nobody",
  "null",
  "undefined",
  "na",
  "n/a",
  "unknown",
  "demo",
  "xyz",
  "abc",
  "asdf",
  "qwerty",
  "temp",
  "foo",
  "bar",
  "baz",
  "none",
  "noname",
  "student",
  "name",
  "yourname",
]);

// 4+ character keyboard sequences
const KEYBOARD_SEQUENCES = [
  "asdf",
  "sdfg",
  "dfgh",
  "fghj",
  "ghjk",
  "hjkl",
  "lkjh",
  "kjhg",
  "jhgf",
  "hgfd",
  "gfds",
  "fdsa",
  "qwer",
  "wert",
  "erty",
  "rtyu",
  "tyui",
  "yuio",
  "uiop",
  "poiu",
  "oiuy",
  "iuyt",
  "uytr",
  "ytre",
  "trew",
  "rewq",
  "zxcv",
  "xcvb",
  "cvbn",
  "vbnm",
  "mnbv",
  "nbvc",
  "bvcx",
  "vcxz",
  "qazw",
  "wsxe",
  "edcr",
  "rfvt",
  "tgby",
];

export function validateMeaningfulName(
  rawInput: string,
  isOptional: boolean = false
): ValidationResult {
  if (!rawInput || typeof rawInput !== "string") {
    if (isOptional) return { valid: true, normalized: "" };
    return { valid: false, error: "Please enter your full name." };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length === 0) {
    if (isOptional) return { valid: true, normalized: "" };
    return { valid: false, error: "Please enter your full name." };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: "Full name must be at least 2 characters long." };
  }

  if (trimmed.length > 70) {
    return { valid: false, error: "Full name is too long (maximum 70 characters)." };
  }

  // Allow alphabetic characters (including unicode letters for Indian names/languages), spaces, dots, hyphens, and apostrophes
  if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) {
    return {
      valid: false,
      error: "Full name can only contain letters, spaces, hyphens, or apostrophes (no numbers or symbols).",
    };
  }

  const lower = trimmed.toLowerCase();

  // Check against known dummy/placeholder names
  const words = lower.split(/\s+/).filter(Boolean);
  for (const w of words) {
    const cleanWord = w.replace(/[^a-z]/g, "");
    if (DUMMY_NAMES.has(cleanWord)) {
      return {
        valid: false,
        error: `"${w}" is not accepted as a genuine name. Please enter your real full name.`,
      };
    }
  }

  // Check for 3 or more identical consecutive characters (e.g. "aaaa", "zzzz")
  if (/(.)\1{2,}/i.test(lower)) {
    return {
      valid: false,
      error: "Name cannot contain repetitive characters (e.g., 'aaa').",
    };
  }

  // Check for common keyboard mashing sequences (e.g. "asdf", "qwer", "zxcv")
  const strippedAlpha = lower.replace(/[^a-z]/g, "");
  for (const seq of KEYBOARD_SEQUENCES) {
    if (strippedAlpha.includes(seq)) {
      return {
        valid: false,
        error: "Please enter a genuine name, not keyboard mashing.",
      };
    }
  }

  // Home-row only mash detection (e.g. "dafklahslf" - all characters from 'asdfghjkl')
  // If word is >= 6 chars and exclusively contains homerow consonants/letters with unnatural consonant ending
  const homeRowKeys = new Set(["a", "s", "d", "f", "g", "h", "j", "k", "l"]);
  for (const w of words) {
    const cleanWord = w.replace(/[^a-z]/g, "");
    if (cleanWord.length >= 6) {
      const isAllHomeRow = cleanWord.split("").every((ch) => homeRowKeys.has(ch));
      // End with 3+ consonants or bad vowel balance
      if (isAllHomeRow && (/[bcdfghjklmnpqrstvwxz]{3,}$/i.test(cleanWord) || !/[aeiouy]/i.test(cleanWord))) {
        return {
          valid: false,
          error: "Please enter a valid, meaningful name (avoid random keyboard characters).",
        };
      }
    }
  }

  // Vowel & structure check: Each name word with 2 or more letters must contain at least one vowel
  // (All legitimate Indian, English, and global transliterated names have vowels/y)
  for (const w of words) {
    const cleanWord = w.replace(/[^a-z]/g, "");
    if (cleanWord.length >= 2 && !/[aeiouy]/i.test(cleanWord)) {
      return {
        valid: false,
        error: `"${w}" is missing vowels. Please enter a valid, meaningful name.`,
      };
    }
    // Reject excessive consecutive consonants without a vowel (5 or more in a row)
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(cleanWord)) {
      return {
        valid: false,
        error: "Please enter a valid, meaningful name.",
      };
    }
    // Reject 4 consecutive consonants at the end of word (e.g. "...hslf" in "dafklahslf")
    if (cleanWord.length >= 5 && /[bcdfghjklmnpqrstvwxz]{4,}$/i.test(cleanWord)) {
      return {
        valid: false,
        error: "Please enter a valid, meaningful name (e.g. Rahul Sharma).",
      };
    }
    // If word has 4+ characters, require at least 3 unique characters (reject "abab", "zxzx")
    if (cleanWord.length >= 4) {
      const uniqueCount = new Set(cleanWord.split("")).size;
      if (uniqueCount < 3) {
        return {
          valid: false,
          error: "Please enter a valid, meaningful full name.",
        };
      }
    }
  }

  return { valid: true, normalized: trimmed };
}

// -------------------------------------------------------------
// 3. MEANINGFUL EMAIL VALIDATION
// -------------------------------------------------------------
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "yopmail.com",
  "trashmail.com",
  "temp-mail.org",
  "dyleris.com",
  "dispostable.com",
  "maildrop.cc",
  "getnada.com",
  "mailnesia.com",
  "throwawaymail.com",
  "burnermail.io",
  "sharklasers.com",
  "fakemailgenerator.com",
  "inboxkitten.com",
  "mohmal.com",
  "crazymailing.com",
  "nada.ltd",
  "dropmail.me",
  "mytemp.email",
  "emailondeck.com",
  "getairmail.com",
  "spambog.com",
  "generator.email",
  "disposablemail.com",
]);

const DUMMY_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "testing.com",
  "fake.com",
  "fakemail.com",
  "dummy.com",
  "sample.com",
  "asdf.com",
  "temp.com",
  "xyz.com",
  "abc.com",
  "domain.com",
  "invalid.com",
  "none.com",
  "null.com",
  "email.com",
]);

const DUMMY_USERNAMES = new Set([
  "test",
  "testing",
  "admin",
  "fake",
  "dummy",
  "sample",
  "user",
  "guest",
  "asdf",
  "qwerty",
  "abc",
  "xyz",
  "temp",
  "noemail",
  "none",
  "null",
  "dafklahslf",
]);

export function validateMeaningfulEmail(
  rawInput: string,
  isOptional: boolean = false
): ValidationResult {
  if (!rawInput || typeof rawInput !== "string") {
    if (isOptional) return { valid: true, normalized: "" };
    return { valid: false, error: "Please enter your email address." };
  }

  const trimmed = rawInput.trim().toLowerCase();
  if (trimmed.length === 0) {
    if (isOptional) return { valid: true, normalized: "" };
    return { valid: false, error: "Please enter your email address." };
  }

  // Basic RFC pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address (e.g. name@gmail.com)." };
  }

  const [username, domain] = trimmed.split("@");

  if (!username || !domain) {
    return { valid: false, error: "Please enter a complete email address." };
  }

  if (username.length < 2) {
    return { valid: false, error: "Email username is too short." };
  }

  // Check username against dummy usernames
  const cleanUsername = username.replace(/[^a-z0-9]/g, "");
  if (DUMMY_USERNAMES.has(cleanUsername)) {
    return {
      valid: false,
      error: "Please enter a genuine personal email address, not a test account.",
    };
  }

  // Check repetitive username (e.g. "aaaa@...", "1111@...")
  if (/^(\w)\1{3,}$/.test(cleanUsername)) {
    return {
      valid: false,
      error: "Please enter a genuine email address, not repetitive characters.",
    };
  }

  // Check disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Temporary or disposable email addresses are not permitted. Please use your personal email.",
    };
  }

  // Check dummy domains
  if (DUMMY_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Please enter a genuine email provider (e.g. Gmail, Yahoo, Outlook, or institutional domain).",
    };
  }

  // Check domain TLD length
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) {
    return { valid: false, error: "Invalid email domain extension." };
  }

  return { valid: true, normalized: trimmed };
}
