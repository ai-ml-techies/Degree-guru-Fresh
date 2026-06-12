import { useState, useEffect } from "react";
import { Phone, X, MessageCircle } from "lucide-react";

export const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-5 z-[300] flex flex-col items-end gap-3 animate-slide-up float-cta-container">
      {/* Expanded action buttons */}
      {expanded && (
        <div className="flex flex-col gap-3 items-end animate-pop-in">
          {/* WhatsApp */}
          <a
            href="https://wa.me/919350199001?text=Hi%2C%20I%20want%20free%20career%20counseling"
            target="_blank"
            rel="noreferrer"
            className="float-cta-btn w-14 h-14"
            style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.45)" }}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={24} color="#fff" fill="#fff" />
          </a>

          {/* Call */}
          <a
            href="tel:+919350199001"
            className="float-cta-btn w-14 h-14"
            style={{
              background: "linear-gradient(135deg, hsl(258 93% 56%), hsl(258 93% 65%))",
              boxShadow: "0 8px 24px hsl(258 93% 56% / 0.45)",
            }}
            aria-label="Call us"
          >
            <Phone size={22} color="#fff" />
          </a>
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Close contact options" : "Contact us"}
        className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: expanded
            ? "hsl(0 0% 20%)"
            : "linear-gradient(135deg, hsl(258 93% 56%), hsl(258 93% 68%))",
          boxShadow: expanded
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "0 8px 28px hsl(258 93% 56% / 0.5)",
        }}
      >
        {/* Ping ring — only when collapsed */}
        {!expanded && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: "hsl(258 93% 56%)" }} />
            <span className="absolute inset-[-6px] rounded-full border-2 border-primary/30 animate-wa-ping" />
          </>
        )}
        <span className="relative transition-transform duration-300" style={{ transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>
          {expanded ? <X size={22} color="#fff" /> : <MessageCircle size={24} color="#fff" fill="rgba(255,255,255,0.25)" />}
        </span>
      </button>

      {/* Tooltip label — only when collapsed */}
      {!expanded && (
        <div
          className="absolute right-[72px] bottom-4 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ animation: "fade-in 0.3s ease-out 3s forwards", opacity: 0 }}
        >
          Free Counseling
        </div>
      )}
    </div>
  );
};
