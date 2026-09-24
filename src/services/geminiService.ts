/**
 * Gemini API Service for Degree Guru
 * Uses Google's Gemini Flash model to provide intelligent career and degree guidance.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_INSTRUCTION = `You are Degree Guru AI Advisor, an expert academic and career counseling assistant for Degree Guru (India's premier independent higher education and online degree decision platform).

Your goals:
1. Help students, working professionals, and graduates discover the right online degree (Online MBA, MCA, BCA, BBA, B.Com, M.Com, MA, M.Sc, DBA, Professional Certifications) based on their career aspirations, eligibility, budget, and time commitment.
2. Explain university accreditations accurately: UGC-DEB entitlement, NAAC grades (A++, A+, A), AICTE approval, NIRF rankings, and international equivalency (WES, AIU).
3. Offer transparent fee context and mention 0% interest monthly EMI options when relevant.
4. Recommend top accredited universities featured on Degree Guru: Amity University Online, Online Manipal (MUJ), Dr. D.Y. Patil Vidyapeeth (DPU Pune), Shoolini University Online, Chandigarh University (CU Online), LPU Online, NMIMS Global, etc.
5. Keep your tone encouraging, objective, concise, and structured (use bullet points and bold highlights).
6. Always remind students that Degree Guru provides 100% free personalized human counseling and university comparisons.`;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export async function askGeminiAdvisor(
  prompt: string,
  history: ChatMessage[] = [],
  language: "en" | "hi" = "en"
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return getFallbackAdvice(prompt, language);
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const langInstruction = language === "hi"
    ? "\n\nCRITICAL LANGUAGE INSTRUCTION: You must respond in fluent, respectful, natural Hindi (Devanagari script) with standard education terminology. Make it easy to read and helpful."
    : "\n\nRespond in clear, professional English.";

  // Build contents array with history and current prompt
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION + langInstruction }],
    },
    {
      role: "model",
      parts: [
        {
          text: language === "hi"
            ? "नमस्ते! मैं Guru AI हूँ। मैं आपकी ऑनलाइन डिग्री, विश्वविद्यालय चयन और करियर संबंधी प्रश्नों में पूरी सहायता करूँगा।"
            : "Understood. I am Guru AI. I will provide students and professionals with accurate, concise, and helpful advice on accredited online degrees, university options, and career pathways.",
        },
      ],
    },
    ...history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}`);
      return getFallbackAdvice(prompt);
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText && typeof candidateText === "string") {
      return candidateText.trim();
    }

    return getFallbackAdvice(prompt);
  } catch (error) {
    console.error("Gemini API request error:", error);
    return getFallbackAdvice(prompt);
  }
}

/**
 * Intelligent local fallback if API is unavailable or rate-limited
 */
function getFallbackAdvice(query: string, language: "en" | "hi" = "en"): string {
  const lower = query.toLowerCase();

  if (language === "hi") {
    if (lower.includes("mba")) {
      return "ऑनलाइन एमबीए (Online MBA) भारत में सबसे लोकप्रिय डिग्री है। प्रमुख यूजीसी-अनुमोदित विश्वविद्यालय जैसे **Amity Online**, **Online Manipal (MUJ)**, **DPU Pune** और **Chandigarh University** हैं। इनकी कुल फीस लगभग ₹1.2 लाख से ₹2.6 लाख तक होती है, जिसमें 0% ईएमआई (EMI) विकल्प भी उपलब्ध हैं।";
    }
    if (lower.includes("fee") || lower.includes("फीस") || lower.includes("emi")) {
      return "ऑनलाइन डिग्री की फीस बैचलर्स प्रोग्राम के लिए लगभग ₹60,000 से ₹1.8 लाख और मास्टर्स के लिए ₹1.1 लाख से ₹2.6 लाख तक होती है। Degree Guru के साथ आप 0% ब्याज ईएमआई पर एडमिशन ले सकते हैं।";
    }
    return "नमस्ते! मैं Guru AI हूँ। मैं आपको यूजीसी-मान्यता प्राप्त ऑनलाइन विश्वविद्यालयों (जैसे Manipal, Amity, DPU, Chandigarh) की सही जानकारी, फीस और 0% EMI विकल्पों में पूरी मदद करूँगा। आप किस डिग्री के बारे में जानना चाहते हैं?";
  }

  if (lower.includes("mba")) {
    return "Online MBA is India's most popular postgraduate program for working professionals. Top UGC-DEB entitled universities include **Amity University Online**, **Online Manipal (MUJ)**, **DPU Pune**, and **Chandigarh University**. Fees range from ₹1.2 Lakh to ₹2.6 Lakh with 0% EMI starting around ₹4,200/month. Specializations include Dual Specialization, Finance, Marketing, HR, and Business Analytics.";
  }

  if (lower.includes("mca") || lower.includes("bca") || lower.includes("tech") || lower.includes("code")) {
    return "For technology careers, **Online MCA** and **Online BCA** provide hands-on training in Full Stack Development, Cloud Computing, AI & Machine Learning. Universities like **Chandigarh University**, **Amity Online**, and **Online Manipal** offer accredited degrees with remote labs and placement support.";
  }

  if (lower.includes("fee") || lower.includes("cost") || lower.includes("emi")) {
    return "Online degree fees in India generally range from ₹70,000 to ₹1,90,000 for Bachelor's programs, and ₹1,10,000 to ₹2,80,000 for Master's programs. Degree Guru partners with universities offering **no-cost 0% EMI installments** starting as low as ₹3,500/month with zero upfront processing fees.";
  }

  return "I am Guru AI, your dedicated academic counselor. I can help you compare 50+ UGC-DEB entitled online universities, calculate 0% interest EMI options, and discover the best degree for your career goals. Which course are you interested in?";
}
