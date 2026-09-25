import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, User, Phone, Mail, Calendar, MessageSquare, Sparkles, Loader2, MapPin, ChevronDown, ShieldCheck, KeyRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { submitCounselingLead, sendEmailOtp, verifyEmailOtp } from "@/lib/api";

interface CountryCode {
  name: string;
  dialCode: string;
  flag: string;
  code: string;
}

const COUNTRIES: CountryCode[] = [
  // India on top & default
  { name: "India", dialCode: "+91", flag: "🇮🇳", code: "IN" },
  // Alphabetical list of other countries
  { name: "Australia", dialCode: "+61", flag: "🇦🇺", code: "AU" },
  { name: "Bahrain", dialCode: "+973", flag: "🇧🇭", code: "BH" },
  { name: "Bangladesh", dialCode: "+880", flag: "🇧🇩", code: "BD" },
  { name: "Bhutan", dialCode: "+975", flag: "🇧🇹", code: "BT" },
  { name: "Canada", dialCode: "+1", flag: "🇨🇦", code: "CA" },
  { name: "China", dialCode: "+86", flag: "🇨🇳", code: "CN" },
  { name: "Egypt", dialCode: "+20", flag: "🇪🇬", code: "EG" },
  { name: "France", dialCode: "+33", flag: "🇫🇷", code: "FR" },
  { name: "Germany", dialCode: "+49", flag: "🇩🇪", code: "DE" },
  { name: "Hong Kong", dialCode: "+852", flag: "🇭🇰", code: "HK" },
  { name: "Indonesia", dialCode: "+62", flag: "🇮🇩", code: "ID" },
  { name: "Ireland", dialCode: "+353", flag: "🇮🇪", code: "IE" },
  { name: "Italy", dialCode: "+39", flag: "🇮🇹", code: "IT" },
  { name: "Japan", dialCode: "+81", flag: "🇯🇵", code: "JP" },
  { name: "Kenya", dialCode: "+254", flag: "🇰🇪", code: "KE" },
  { name: "Kuwait", dialCode: "+965", flag: "🇰🇼", code: "KW" },
  { name: "Malaysia", dialCode: "+60", flag: "🇲🇾", code: "MY" },
  { name: "Maldives", dialCode: "+960", flag: "🇲🇻", code: "MV" },
  { name: "Mauritius", dialCode: "+230", flag: "🇲🇺", code: "MU" },
  { name: "Nepal", dialCode: "+977", flag: "🇳🇵", code: "NP" },
  { name: "Netherlands", dialCode: "+31", flag: "🇳🇱", code: "NL" },
  { name: "New Zealand", dialCode: "+64", flag: "🇳🇿", code: "NZ" },
  { name: "Nigeria", dialCode: "+234", flag: "🇳🇬", code: "NG" },
  { name: "Oman", dialCode: "+968", flag: "🇴🇲", code: "OM" },
  { name: "Philippines", dialCode: "+63", flag: "🇵🇭", code: "PH" },
  { name: "Qatar", dialCode: "+974", flag: "🇶🇦", code: "QA" },
  { name: "Russia", dialCode: "+7", flag: "🇷🇺", code: "RU" },
  { name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", code: "SA" },
  { name: "Singapore", dialCode: "+65", flag: "🇸🇬", code: "SG" },
  { name: "South Africa", dialCode: "+27", flag: "🇿🇦", code: "ZA" },
  { name: "South Korea", dialCode: "+82", flag: "🇰🇷", code: "KR" },
  { name: "Spain", dialCode: "+34", flag: "🇪🇸", code: "ES" },
  { name: "Sri Lanka", dialCode: "+94", flag: "🇱🇰", code: "LK" },
  { name: "Switzerland", dialCode: "+41", flag: "🇨🇭", code: "CH" },
  { name: "Thailand", dialCode: "+66", flag: "🇹🇭", code: "TH" },
  { name: "Turkey", dialCode: "+90", flag: "🇹🇷", code: "TR" },
  { name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪", code: "AE" },
  { name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", code: "GB" },
  { name: "United States", dialCode: "+1", flag: "🇺🇸", code: "US" },
  { name: "Vietnam", dialCode: "+84", flag: "🇻🇳", code: "VN" },
];

const INDIAN_STATES_AND_UTS = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

interface Props {
  compact?: boolean;
  buttonLabel?: string;
  source?: string;
  defaultProgram?: string;
  onSubmitDone?: () => void;
}

export const CounselingForm = ({
  compact = false,
  buttonLabel = "Request Free Counseling Call",
  source,
  defaultProgram,
  onSubmitDone,
}: Props) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]); // India default
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    state: "",
    message: defaultProgram || "",
  });

  // OTP Verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handle = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (k === "email") {
      // If user edits email, reset verification
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
      setDevOtpHint(null);
    }
    setForm({ ...form, [k]: e.target.value });
  };

  const isIndia = selectedCountry.code === "IN";

  // Trigger Send OTP
  const handleSendOtp = async () => {
    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your email address first.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const domain = trimmedEmail.split("@")[1] ?? "";
    const blockedDomains = [
      "mailinator.com",
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
      "yopmail.com",
      "temp-mail.org",
      "dyleris.com",
    ];
    if (blockedDomains.includes(domain)) {
      toast.error("Temporary/disposable email addresses are not permitted.");
      return;
    }

    setOtpSending(true);
    try {
      const res = await sendEmailOtp(trimmedEmail);
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(45);
        if (res.dev_otp) setDevOtpHint(res.dev_otp);
        toast.success("Verification code sent to your email!");
      } else {
        toast.error(res.message || "Failed to send verification code.");
      }
    } catch {
      toast.error("Could not send code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // Trigger Verify OTP
  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      toast.error("Please enter the verification code.");
      return;
    }
    setOtpVerifying(true);
    try {
      const res = await verifyEmailOtp(form.email, cleanOtp);
      if (res.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setDevOtpHint(null);
        toast.success("Email verified successfully! ✓");
      } else {
        toast.error(res.message || "Invalid verification code. Please check and try again.");
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Full Name (Mandatory)
    const trimmedName = form.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!/^[\p{L} .'-]{2,}$/u.test(trimmedName)) {
      toast.error("Full name contains invalid characters.");
      return;
    }

    // 2. Validate Phone (Mandatory)
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (isIndia) {
      if (phoneDigits.length < 10) {
        toast.error("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      const last10 = phoneDigits.slice(-10);
      if (!/^[6-9]\d{9}$/.test(last10)) {
        toast.error("Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.");
        return;
      }
    } else {
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        toast.error("Please enter a valid phone number (7 to 15 digits).");
        return;
      }
    }

    // 3. Validate Email & OTP Verification (Mandatory)
    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email with the OTP code first.");
      if (!otpSent) {
        handleSendOtp();
      }
      return;
    }

    // 4. Validate Date of Birth (Mandatory)
    if (!form.dob) {
      toast.error("Please select your date of birth.");
      return;
    }

    // 5. Validate State / Union Territory (Mandatory)
    if (!form.state.trim()) {
      toast.error(
        isIndia
          ? "Please select your State or Union Territory."
          : "Please specify your State / Province / Region."
      );
      return;
    }

    // Full formatted phone with dial code
    const fullPhoneNumber = isIndia
      ? phoneDigits.slice(-10)
      : `${selectedCountry.dialCode} ${phoneDigits}`;

    const messagePayload = form.message.trim()
      ? `[${form.state}, ${selectedCountry.name}] ${form.message.trim()}`
      : `Seeking guidance for online degree programs [${form.state}, ${selectedCountry.name}]`;

    setSubmitting(true);
    try {
      const result = await submitCounselingLead({
        name: trimmedName,
        phone: fullPhoneNumber,
        email: trimmedEmail,
        dob: form.dob,
        state: form.state.trim(),
        countryCode: selectedCountry.dialCode,
        message: messagePayload,
        source: source || "counseling-lead-form",
      });

      if (result.success) {
        setSubmitted(true);
        toast.success("Thank you! Our expert academic counselor will connect with you shortly.");
        setTimeout(() => {
          setForm({
            name: "",
            email: "",
            phone: "",
            dob: "",
            state: "",
            message: defaultProgram || "",
          });
          setEmailVerified(false);
          setOtpSent(false);
          setOtp("");
          setSubmitted(false);
          onSubmitDone?.();
        }, 3500);
      } else {
        const msg = result.errors?.[0] ?? result.message ?? "Submission failed. Please try again.";
        toast.error(msg);
      }
    } catch {
      toast.error("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls = (field: string) =>
    `w-full bg-background border rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 outline-none placeholder:text-foreground/40 placeholder:font-normal ${
      focusedField === field
        ? "border-primary ring-2 ring-primary/20 bg-background shadow-xs"
        : "border-border hover:border-foreground/30"
    }`;

  const iconCls = "absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45 transition-colors duration-200 pointer-events-none";
  const iconActiveCls = "absolute left-3 top-1/2 -translate-y-1/2 text-primary transition-colors duration-200 pointer-events-none";

  if (submitted) {
    return (
      <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[300px] animate-[fade-in-up_0.4s_ease_forwards]">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <CheckCircle2 size={36} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-black text-foreground">You're all set!</h3>
        <p className="text-xs sm:text-sm font-medium text-foreground/80 max-w-xs leading-relaxed">
          Our expert academic counselor will connect with you at{" "}
          <span className="font-bold text-foreground">
            {selectedCountry.dialCode} {form.phone}
          </span>{" "}
          shortly with tailored university choices.
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3.5 py-1.5 mt-1">
          <Sparkles size={13} className="text-primary" />
          100% Free Guidance • Unbiased & Student-First
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 pt-1">
      {/* Row 1: Full Name */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-foreground">
          Full Name <span className="text-red-500 font-black">*</span>
        </label>
        <div className="relative">
          <User size={15} className={focusedField === "name" ? iconActiveCls : iconCls} />
          <input
            className={fieldCls("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value.replace(/[0-9]/g, "") })}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your full name"
            maxLength={150}
            required
            disabled={submitting}
          />
        </div>
      </div>

      {/* Row 2: Phone Number with Country Code */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold text-foreground">
          Phone Number <span className="text-red-500 font-black">*</span>
        </label>
        <div className="relative flex rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden transition-all">
          {/* Country Code Trigger */}
          <div className="relative border-r border-border bg-muted/40 shrink-0 flex items-center w-[84px] justify-center hover:bg-muted/70 transition-colors">
            <div className="pointer-events-none flex items-center gap-1 text-xs font-bold text-foreground pl-1.5 pr-4 select-none">
              <span className="text-sm leading-none">{selectedCountry.flag}</span>
              <span>{selectedCountry.dialCode}</span>
            </div>
            <select
              aria-label="Select Country Code"
              value={selectedCountry.code}
              onChange={(e) => {
                const found = COUNTRIES.find((c) => c.code === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              disabled={submitting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="text-foreground bg-card py-1 text-xs font-medium">
                  {c.flag} {c.dialCode} — {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-1.5 text-foreground/50 pointer-events-none" />
          </div>

          <div className="relative flex-1 flex items-center">
            <Phone size={14} className="absolute left-2.5 text-foreground/45 pointer-events-none" />
            <input
              type="tel"
              value={form.phone}
              onChange={handle("phone")}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              placeholder={isIndia ? "10-digit mobile number" : "Mobile number"}
              maxLength={isIndia ? 11 : 16}
              required
              disabled={submitting}
              className="w-full bg-transparent pl-8 pr-3 py-2.5 text-xs sm:text-sm font-semibold text-foreground outline-none placeholder:text-foreground/40 placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Email Address with OTP Verification */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-foreground">
            Email Address <span className="text-red-500 font-black">*</span>
          </label>
          {emailVerified ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={11} className="text-emerald-500" />
              Verified ✓
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSending || !form.email || otpCountdown > 0}
              className="text-[11px] font-bold text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
            >
              {otpSending ? (
                <>
                  <Loader2 size={11} className="animate-spin" /> Sending…
                </>
              ) : otpCountdown > 0 ? (
                `Resend (${otpCountdown}s)`
              ) : (
                "Verify via OTP"
              )}
            </button>
          )}
        </div>

        <div className="relative">
          <Mail size={15} className={focusedField === "email" ? iconActiveCls : iconCls} />
          <input
            type="email"
            className={`${fieldCls("email")} ${
              emailVerified ? "border-emerald-500/60 bg-emerald-500/5 focus:border-emerald-500" : ""
            }`}
            value={form.email}
            onChange={handle("email")}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            placeholder="you@email.com"
            maxLength={255}
            required
            disabled={submitting}
          />
        </div>

        {/* OTP Input Drawer when OTP is sent & not yet verified */}
        {otpSent && !emailVerified && (
          <div className="p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl space-y-2 animate-[fade-in_0.3s_ease]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <KeyRound size={13} className="text-primary" /> Enter 6-digit OTP sent to email:
              </span>
              {devOtpHint && (
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  Test OTP: {devOtpHint}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                className="flex-1 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-3 py-1.5 text-center font-mono font-bold tracking-widest text-sm text-foreground outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpVerifying || otp.length < 4}
                className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              >
                {otpVerifying ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Row 4: Date of Birth and State in ONE row to save vertical height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-foreground">
            Date of Birth <span className="text-red-500 font-black">*</span>
          </label>
          <div className="relative">
            <Calendar size={15} className={focusedField === "dob" ? iconActiveCls : iconCls} />
            <input
              type="date"
              className={fieldCls("dob")}
              value={form.dob}
              onChange={handle("dob")}
              onFocus={() => setFocusedField("dob")}
              onBlur={() => setFocusedField(null)}
              required
              disabled={submitting}
            />
          </div>
        </div>

        {/* State / Union Territory */}
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-foreground">
            {isIndia ? "State / Union Territory" : "State / Province"}{" "}
            <span className="text-red-500 font-black">*</span>
          </label>
          <div className="relative">
            <MapPin size={15} className={focusedField === "state" ? iconActiveCls : iconCls} />
            {isIndia ? (
              <>
                <select
                  className={`${fieldCls("state")} appearance-none pr-8 cursor-pointer truncate`}
                  value={form.state}
                  onChange={handle("state")}
                  onFocus={() => setFocusedField("state")}
                  onBlur={() => setFocusedField(null)}
                  required
                  disabled={submitting}
                >
                  <option value="" disabled className="text-foreground/40">
                    Select your State
                  </option>
                  <optgroup label="── States ──">
                    {INDIAN_STATES_AND_UTS.slice(0, 28).map((st) => (
                      <option key={st} value={st} className="text-foreground bg-card py-1 text-xs">
                        {st}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="── Union Territories ──">
                    {INDIAN_STATES_AND_UTS.slice(28).map((ut) => (
                      <option key={ut} value={ut} className="text-foreground bg-card py-1 text-xs">
                        {ut}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" />
              </>
            ) : (
              <input
                type="text"
                className={fieldCls("state")}
                value={form.state}
                onChange={handle("state")}
                onFocus={() => setFocusedField("state")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter State / Province"
                required
                disabled={submitting}
              />
            )}
          </div>
        </div>
      </div>

      {/* Row 5: What are you looking for? (Message - Optional) */}
      {!compact && (
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-foreground flex items-center justify-between">
            <span>What are you looking for?</span>
            <span className="text-[10px] font-normal text-foreground/60">(Optional)</span>
          </label>
          <div className="relative">
            <MessageSquare
              size={15}
              className={`absolute left-3 top-2.5 transition-colors duration-200 ${
                focusedField === "message" ? "text-primary" : "text-foreground/45"
              }`}
            />
            <input
              type="text"
              className={`${fieldCls("message")} text-xs font-normal`}
              value={form.message}
              onChange={handle("message")}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder="Target degree, program, or university preference"
              disabled={submitting}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary btn-primary-pulse w-full py-3 mt-1 rounded-xl text-xs sm:text-sm font-extrabold text-white flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Submitting Guidance Request…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {buttonLabel}
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        )}
      </button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 pt-0.5">
        {["100% Free", "Zero Spam", "Verified Advisors"].map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-[11px] font-semibold text-foreground/75">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            {tag}
          </span>
        ))}
      </div>
    </form>
  );
};

export default CounselingForm;
