import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  X, 
  RotateCcw,
  GraduationCap, 
  Building2, 
  Briefcase, 
  FileText, 
  Calculator, 
  Compass, 
  MessageCircle, 
  ArrowRight,
  Send,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { askGeminiAdvisor } from "@/services/geminiService";
import { useLanguage } from "@/context/LanguageContext";
import { WhatsAppIcon } from "@/components/SocialIcons";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: () => void; link?: string }[];
};

export const FloatingAiAdvisor = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { language } = useLanguage();

  // Initial prompt templates based on language
  const resetConversation = (lang = language) => {
    if (lang === "hi") {
      setMessages([
        {
          id: "m-init-1",
          sender: "bot",
          text: "नमस्ते! मैं Guru AI हूँ। मैं आपकी ऑनलाइन डिग्री, विश्वविद्यालय चयन, फीस और प्रवेश से जुड़े सभी सवालों में मदद कर सकता हूँ।\n\nआप क्या जानना चाहते हैं?",
          options: [
            {
              label: "🎓 ऑनलाइन मास्टर्स (MBA, MCA, M.Com)",
              action: () => handleSelect("Online Master's", "hi"),
            },
            {
              label: "🏛️ ऑनलाइन बैचलर्स (BCA, BBA, B.Com)",
              action: () => handleSelect("Online Bachelor's", "hi"),
            },
            {
              label: "🎯 10वीं व 12वीं ओपन स्कूलिंग (100% ऑनलाइन)",
              action: () => handleSelect("Class 10 & 12", "hi"),
            },
            {
              label: "💼 जॉब्स और करियर सहायता",
              action: () => handleSelect("Jobs & Career", "hi"),
            },
            {
              label: "📄 फ्री ATS रिज्यूमे बनाएं",
              action: () => handleSelect("Resume Builder", "hi"),
            },
            {
              label: "💰 0% ब्याज EMI कैलकुलेटर",
              action: () => handleSelect("EMI Calculator", "hi"),
            },
          ],
        },
      ]);
    } else {
      setMessages([
        {
          id: "m-init-1",
          sender: "bot",
          text: "👋 Hi! I'm Guru AI. I can guide you through accredited online degrees, university fee structures, and career decisions.\n\nWhat are you interested in exploring today?",
          options: [
            {
              label: "🎓 Online Master's (MBA, MCA, etc.)",
              action: () => handleSelect("Online Master's", "en"),
            },
            {
              label: "🏛️ Online Bachelor's (BCA, BBA, B.Com)",
              action: () => handleSelect("Online Bachelor's", "en"),
            },
            {
              label: "🎯 Class 10 & 12 (Direct Online Exams)",
              action: () => handleSelect("Class 10 & 12", "en"),
            },
            {
              label: "💼 Find Jobs & Career Switch",
              action: () => handleSelect("Jobs & Career", "en"),
            },
            {
              label: "📄 Build ATS Resume (Free)",
              action: () => handleSelect("Resume Builder", "en"),
            },
            {
              label: "💰 Calculate 0% EMI",
              action: () => handleSelect("EMI Calculator", "en"),
            },
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    resetConversation(language);
  }, [language]);

  const handleSelect = (choice: string, lang = language) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: choice,
    };

    let botResponse: Message;

    if (lang === "hi") {
      if (choice === "Online Master's") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "ऑनलाइन मास्टर्स प्रोग्राम (जैसे Online MBA, Online MCA, M.Com) 100% ऑनलाइन परीक्षा और UGC-DEB मान्यता के साथ उपलब्ध हैं। कौन सा प्रोग्राम आपकी पसंद है?",
          options: [
            { label: "Online MBA (टॉप चॉइस)", action: () => {}, link: "/online-mba" },
            { label: "Online MCA (टेक्नोलॉजी)", action: () => {}, link: "/online-mca" },
            { label: "Online M.Com (कॉमर्स)", action: () => {}, link: "/online-mcom" },
            { label: "विश्वविद्यालय तुलना करें", action: () => {}, link: "/universities/compare" },
          ],
        };
      } else if (choice === "Online Bachelor's") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "ऑनलाइन बैचलर्स डिग्री आपको घर बैठे जॉब या स्किल सीखने के साथ यूजीसी-मान्यता प्राप्त डिग्री देती है। मुख्य प्रोग्राम:",
          options: [
            { label: "Online BCA (सॉफ्टवेयर/कोडिंग)", action: () => {}, link: "/online-bca" },
            { label: "Online BBA (मैनेजमेंट)", action: () => {}, link: "/online-bba" },
            { label: "Online B.Com (फाइनेंस)", action: () => {}, link: "/online-bcom" },
            { label: "सभी बैचलर्स देखें", action: () => {}, link: "/courses" },
          ],
        };
      } else if (choice === "Class 10 & 12") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "आप मान्यता प्राप्त ओपन बोर्ड से 10वीं और 12वीं की परीक्षा 100% ऑनलाइन दे सकते हैं। यदि आपके पास पिछली मार्कशीट नहीं है तब भी आप आवेदन कर सकते हैं।",
          options: [
            { label: "10वीं एडमिशन विवरण", action: () => {}, link: "/class-10" },
            { label: "12वीं एडमिशन विवरण", action: () => {}, link: "/class-12" },
          ],
        };
      } else if (choice === "Jobs & Career") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Degree Guru सीधे रिक्रूटर्स और एम्प्लॉयर्स से आपका संपर्क कराता है। साथ ही आप फ्री करियर मैचिंग टेस्ट भी दे सकते हैं।",
          options: [
            { label: "नौकरियां खोजें (Jobs)", action: () => {}, link: "/jobs/job-seeker" },
            { label: "फ्री करियर टेस्ट दें", action: () => {}, link: "/career-finder" },
          ],
        };
      } else if (choice === "Resume Builder") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "हमारा ATS रिज्यूमे बिल्डर 100% फ्री है और आपके रिज्यूमे को रिक्रूटर सॉफ्टवेयर (ATS) पास करने योग्य बनाता है।",
          options: [
            { label: "रिज्यूमे बिल्डर खोलें", action: () => {}, link: "/resume-builder" },
          ],
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "0% ब्याज ईएमआई कैलकुलेटर से आप अपने कोर्स की मासिक किस्त बिना किसी अतिरिक्त ब्याज के जान सकते हैं।",
          options: [
            { label: "EMI कैलकुलेटर खोलें", action: () => {}, link: "/emi-calculator" },
            { label: "विश्वविद्यालय तुलना", action: () => {}, link: "/universities/compare" },
          ],
        };
      }
    } else {
      if (choice === "Online Master's") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Great! Online Master's programs (like Online MBA, Online MCA, and Online M.Com) offer UGC-DEB recognition with 100% remote proctored exams and zero commute. Which degree catches your interest?",
          options: [
            { label: "Online MBA (Top Pick)", action: () => {}, link: "/online-mba" },
            { label: "Online MCA (Tech)", action: () => {}, link: "/online-mca" },
            { label: "Online M.Com (Commerce)", action: () => {}, link: "/online-mcom" },
            { label: "Compare All Universities", action: () => {}, link: "/universities/compare" },
          ],
        };
      } else if (choice === "Online Bachelor's") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Online Bachelor's degrees allow you to build an accredited undergraduate qualification while working or learning practical skills in parallel. Top choices:",
          options: [
            { label: "Online BCA (Software / Coding)", action: () => {}, link: "/online-bca" },
            { label: "Online BBA (Management)", action: () => {}, link: "/online-bba" },
            { label: "Online B.Com (Finance)", action: () => {}, link: "/online-bcom" },
            { label: "Browse All Bachelor's", action: () => {}, link: "/courses" },
          ],
        };
      } else if (choice === "Class 10 & 12") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "You can complete recognized Secondary (Class 10) or Senior Secondary (Class 12) through 100% online exams — even if you never attended formal school or lack an 8th/9th marksheet! Please note: One-time fee, strictly no EMI.",
          options: [
            { label: "Class 10 Details & Admission", action: () => {}, link: "/class-10" },
            { label: "Class 12 Details & Streams", action: () => {}, link: "/class-12" },
          ],
        };
      } else if (choice === "Jobs & Career") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Degree Guru provides a 100% free employment marketplace connecting qualified learners directly to employers, plus a scenario-based Career Finder.",
          options: [
            { label: "Explore Job Openings", action: () => {}, link: "/jobs/job-seeker" },
            { label: "Take Free Career Finder", action: () => {}, link: "/career-finder" },
          ],
        };
      } else if (choice === "Resume Builder") {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Our AI ATS Resume Builder turns your accomplishments into quantified, recruiter-ready bullet points and formats them into an ATS-friendly layout.",
          options: [
            { label: "Launch AI Resume Builder", action: () => {}, link: "/resume-builder" },
          ],
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "Calculate your affordable monthly installments with our 0% interest education planner across 50+ UGC-approved online degrees.",
          options: [
            { label: "Open 0% EMI Calculator", action: () => {}, link: "/emi-calculator" },
            { label: "Compare Universities", action: () => {}, link: "/universities/compare" },
          ],
        };
      }
    }

    setMessages((prev) => [...prev, userMsg, botResponse]);
  };

  const handleCustomSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;
    const query = userInput.trim();
    setUserInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const aiReply = await askGeminiAdvisor(query, history, language);

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: aiReply,
        options: language === "hi" ? [
          { label: "ऑनलाइन डिग्री देखें", action: () => {}, link: "/courses" },
          { label: "विश्वविद्यालय तुलना", action: () => {}, link: "/universities/compare" },
          { label: "0% EMI कैलकुलेटर", action: () => {}, link: "/emi-calculator" },
        ] : [
          { label: "Explore Online Degrees", action: () => {}, link: "/courses" },
          { label: "Compare Universities", action: () => {}, link: "/universities/compare" },
          { label: "Calculate 0% EMI", action: () => {}, link: "/emi-calculator" },
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Guru AI error:", err);
      const fallbackMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: language === "hi" 
          ? "मैं भारत के मान्यता प्राप्त ऑनलाइन विश्वविद्यालयों की जानकारी और सही कोर्स चुनने में आपकी मदद करूँगा। आप किस कोर्स के बारे में जानना चाहते हैं?"
          : "I am here to help you discover the right accredited online degree and compare universities across India. Which course or field are you interested in?",
        options: [
          { label: language === "hi" ? "ऑनलाइन डिग्री देखें" : "Explore Online Degrees", action: () => {}, link: "/courses" },
          { label: language === "hi" ? "विश्वविद्यालय तुलना" : "Compare Universities", action: () => {}, link: "/universities/compare" },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed right-4 sm:right-6 bottom-20 md:bottom-8 z-[90]">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[380px] max-w-[400px] h-[540px] max-h-[82vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-slide-up backdrop-blur-lg">
          {/* Header - Flat Purple (#6528f7) with Guru AI 3D Robot Mascot */}
          <div className="px-4 py-3.5 bg-[#6528f7] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/60 shadow-sm shrink-0 bg-white/10">
                <img
                  src="/assets/guru-ai-mascot.png"
                  alt="Guru AI Mascot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-black flex items-center gap-1.5 leading-tight tracking-tight">
                  Guru AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-white/85 font-medium">
                  {language === "hi" ? "शैक्षणिक और करियर सलाहकार" : "Academic & Career Advisor"}
                </div>
              </div>
            </div>

            {/* Header Controls: Clean Reset & Close */}
            <div className="flex items-center gap-1">
              {/* Reset Button */}
              <button
                type="button"
                onClick={() => resetConversation(language)}
                title={language === "hi" ? "रीसेट चैट" : "Reset Chat"}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                aria-label="Reset Chat"
              >
                <RotateCcw size={14} />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                aria-label="Close Guru AI"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-semibold rounded-br-none"
                      : "bg-muted text-foreground border border-border/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>

                {/* Interactive Option Chips */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.options.map((opt, idx) =>
                      opt.link ? (
                        <Link
                          key={idx}
                          to={opt.link}
                          onClick={() => setIsOpen(false)}
                          className="px-2.5 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-foreground font-semibold text-[11px] transition-all flex items-center gap-1 shadow-sm"
                        >
                          {opt.label} <ArrowRight size={10} />
                        </Link>
                      ) : (
                        <button
                          key={idx}
                          type="button"
                          onClick={opt.action}
                          className="px-2.5 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-foreground font-semibold text-[11px] transition-all flex items-center gap-1 text-left shadow-sm"
                        >
                          {opt.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="p-2.5 px-3 rounded-2xl bg-muted text-foreground border border-border/80 rounded-bl-none shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold text-muted-foreground ml-1">
                    {language === "hi" ? "Guru AI सोच रहा है..." : "Guru AI is typing..."}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input & Caution Footer */}
          <div className="p-2.5 border-t border-border/60 bg-muted/20 space-y-2">
            <form onSubmit={handleCustomSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={language === "hi" ? "अपना प्रश्न यहाँ लिखें..." : "Ask e.g. 'Online MBA fees'..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </form>

            {/* WhatsApp Human Counselor Row */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <a
                href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20need%20human%20career%20counseling"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" /> {language === "hi" ? "काउंसलर से बात करें" : "Talk to Counselor"}
              </a>
              <button
                type="button"
                onClick={() => resetConversation(language)}
                className="hover:underline text-muted-foreground"
              >
                {language === "hi" ? "नया चैट" : "New Chat"}
              </button>
            </div>

            {/* Short Caution Disclaimer */}
            <div className="text-center text-[10px] text-muted-foreground/80 pt-0.5 border-t border-border/40">
              {language === "hi"
                ? "AI-जनित उत्तर हमेशा 100% सटीक नहीं हो सकते।"
                : "AI-generated responses may not always be 100% accurate."}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bot Launch Button & "Ask Guru AI" text pill */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card/95 hover:bg-card text-foreground border border-border/80 shadow-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 group select-none"
            aria-label="Ask Guru AI"
          >
            <Sparkles size={13} className="text-primary group-hover:rotate-12 transition-transform" />
            <span>Ask Guru AI</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close Guru AI" : "Ask Guru AI"}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl ${
            isOpen ? "bg-slate-800 text-white" : "bg-white border border-border/80"
          }`}
        >
          {/* Active Chatbot Ring when closed */}
          {!isOpen && (
            <>
              <span className="absolute -inset-1 rounded-full border-2 border-primary/50 animate-ping opacity-35 pointer-events-none" />
              <span className="absolute -inset-1 rounded-full border border-primary/40 pointer-events-none" />
            </>
          )}

          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="relative w-full h-full overflow-hidden rounded-full">
              <img
                src="/assets/guru-ai-mascot.png"
                alt="Guru AI Mascot"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingAiAdvisor;
