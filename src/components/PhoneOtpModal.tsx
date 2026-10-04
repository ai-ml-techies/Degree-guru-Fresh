import React, { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { sendSmsOtp, verifySmsOtp } from "@/lib/api";

interface PhoneOtpModalProps {
  isOpen: boolean;
  phoneNumber: string;
  onClose: () => void;
  onVerified: () => void;
}

export const PhoneOtpModal: React.FC<PhoneOtpModalProps> = ({
  isOpen,
  phoneNumber,
  onClose,
  onVerified,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [success, setSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Trigger SMS OTP send when modal opens
  useEffect(() => {
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccess(false);
      return;
    }

    const triggerOtp = async () => {
      setSending(true);
      setError("");
      setOtp(["", "", "", "", "", ""]);

      try {
        const res = await sendSmsOtp(phoneNumber);
        if (res.success) {
          setResendTimer(30);
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 300);
        } else {
          setError(res.message || "Could not send OTP to this mobile number. Please try again.");
        }
      } catch (err: any) {
        console.error("SMS OTP send error:", err);
        setError("Network error while sending SMS OTP. Please try again.");
      } finally {
        setSending(false);
      }
    };

    triggerOtp();
  }, [isOpen, phoneNumber]);

  // Resend Timer countdown
  useEffect(() => {
    if (!isOpen || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || sending || loading) return;
    setSending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await sendSmsOtp(phoneNumber);
      if (res.success) {
        setResendTimer(30);
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError("Network error while resending OTP.");
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedDigits = value.replace(/\D/g, "").slice(0, 6).split("");
      if (pastedDigits.length > 0) {
        const newOtp = [...otp];
        pastedDigits.forEach((digit, i) => {
          if (index + i < 6) {
            newOtp[index + i] = digit;
          }
        });
        setOtp(newOtp);
        const nextIndex = Math.min(index + pastedDigits.length, 5);
        inputRefs.current[nextIndex]?.focus();
        if (newOtp.every((d) => d !== "")) {
          verifyOtp(newOtp.join(""));
        }
      }
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);
    setError("");

    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otp.join("");
    if (finalCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP received on your mobile phone.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifySmsOtp(phoneNumber, finalCode);
      if (res.success || res.verified) {
        setSuccess(true);
        setTimeout(() => {
          onVerified();
        }, 500);
      } else {
        setError(res.message || "Invalid verification code. Please check and try again.");
      }
    } catch (err: any) {
      console.error("SMS OTP verification error:", err);
      setError("Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const cleanDigits = phoneNumber.replace(/\D/g, "").slice(-10);
  const formattedPhone = cleanDigits.length === 10
    ? `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`
    : `+91 ${phoneNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B35]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 border border-slate-200 shadow-2xl relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading || sending}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
          <ShieldCheck size={24} />
        </div>

        {/* Title & Phone Info */}
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-[#071B35] tracking-tight">
            Verify Your Mobile Number
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Enter the 6-digit verification code sent via SMS to{" "}
            <strong className="text-slate-900 font-semibold">{formattedPhone}</strong>.
          </p>
        </div>

        {/* 6-Digit OTP Input Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 sm:gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={loading || sending || success}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border ${
                  error
                    ? "border-red-400 bg-red-50/30 text-red-700"
                    : digit
                    ? "border-[#2F73B2] bg-blue-50/20 text-[#071B35] ring-2 ring-[#2F73B2]/10"
                    : "border-slate-300 text-slate-800"
                } focus:outline-none focus:border-[#2F73B2] focus:ring-2 focus:ring-[#2F73B2]/30 transition-all`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 animate-in fade-in">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>Mobile number verified successfully!</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => verifyOtp()}
            disabled={loading || sending || otp.some((d) => d === "") || success}
            className="w-full py-3 px-4 rounded-xl bg-[#2F73B2] hover:bg-[#255D91] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Verifying OTP...</span>
              </>
            ) : sending ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Sending SMS...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 size={16} />
                <span>Verified!</span>
              </>
            ) : (
              <span>VERIFY &amp; SUBMIT APPLICATION →</span>
            )}
          </button>

          {/* Resend OTP & Edit Number */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={onClose}
              className="hover:text-slate-900 underline transition-colors cursor-pointer"
            >
              Change Phone Number
            </button>

            <div>
              {resendTimer > 0 ? (
                <span>Resend OTP in <strong className="text-slate-800">{resendTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={sending || loading}
                  className="font-bold text-[#2F73B2] hover:text-[#255D91] underline transition-colors cursor-pointer"
                >
                  Resend OTP SMS
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
