import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { OFFLINE_UNIVERSITY } from "@/data/universities";
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Award,
  Send,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { submitLead } from "@/lib/api";

export const OfflineCourses = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Offline Bachelor's / Master's");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameInputId = useId();
  const phoneInputId = useId();
  const courseInputId = useId();

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email: `${phone}@degreeguru.in`,
        program: `Offline M.K. University - ${selectedCourse}`,
        source: "offline-courses-page",
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Offline Courses — M.K. University, Patan | Degree Guru</title>
        <meta
          name="description"
          content="Explore regular on-campus offline degree courses offered through Degree Guru at M.K. University, Patan. Classroom learning, practical labs, and campus degree programs."
        />
        <link rel="canonical" href="https://degreeguru.in/offline-courses/" />
      </Helmet>

      <div className="container-dg py-8 md:py-14">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold mb-3">
            <Building2 size={14} /> Regular On-Campus Offline Education
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Offline Courses: M.K. University, Patan
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
            Looking for structured, on-campus classroom lectures and lab environments? Degree Guru facilitates regular offline admissions at M.K. University, Patan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase">
                  Offline Campus
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <MapPin size={13} /> Patan, Gujarat
                </span>
              </div>

              <h2 className="text-2xl font-black text-foreground">
                About M.K. University Offline Education
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {OFFLINE_UNIVERSITY.overview}
              </p>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                <strong>Important Distinction:</strong> Unlike 100% online universities where examinations and lectures are conducted digitally via web portals, M.K. University courses require physical on-campus attendance, classroom sessions, and on-site examination halls in Patan, Gujarat.
              </div>

              {/* Popular Offline Programs */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap size={16} className="text-primary" /> Regular Offline Programs Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OFFLINE_UNIVERSITY.popularPrograms.map((prog, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs font-semibold text-foreground flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Mode</span>
                  <span className="text-xs font-bold text-foreground">100% Offline Campus</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Campus City</span>
                  <span className="text-xs font-bold text-foreground">Patan, Gujarat</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Campus Facilities</span>
                  <span className="text-xs font-bold text-foreground">Labs & Library</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Form (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="pb-3 border-b border-border/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Admissions Desk
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                Inquire for M.K. University Offline Admissions
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our counselor will connect you with fee schedules, hostel info, and syllabus details.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>Your offline inquiry is registered! An advisor will call you shortly with campus admission details.</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label htmlFor={nameInputId} className="block text-xs font-semibold text-muted-foreground mb-1">Your Full Name</label>
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    placeholder="e.g. Yash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={phoneInputId} className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
                  <input
                    id={phoneInputId}
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={courseInputId} className="block text-xs font-semibold text-muted-foreground mb-1">Target Program</label>
                  <select
                    id={courseInputId}
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  >
                    {OFFLINE_UNIVERSITY.popularPrograms.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Request Offline Campus Details
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default OfflineCourses;
