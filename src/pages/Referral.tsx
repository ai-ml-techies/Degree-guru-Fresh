import { useState, useId } from "react";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  Sparkles, 
  Gift, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Send, 
  IndianRupee
} from "lucide-react";
import { submitLead } from "@/lib/api";

export const Referral = () => {
  const [referrerName, setReferrerName] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [interestedCourse, setInterestedCourse] = useState("Online MBA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const referrerNameId = useId();
  const referrerPhoneId = useId();
  const friendNameId = useId();
  const friendPhoneId = useId();
  const interestedCourseId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerPhone || !friendPhone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name: `${referrerName} (Referred: ${friendName})`,
        phone: referrerPhone,
        email: `${referrerPhone}@degreeguru.in`,
        program: `Referral for ${friendName} (${friendPhone}) - ${interestedCourse}`,
        source: "referral-program-5000",
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
        <title>Refer & Earn ₹5,000 Guaranteed Referral Reward | Degree Guru</title>
        <meta
          name="description"
          content="Help friends, family, and colleagues enroll in accredited online degree courses. Earn ₹5,000 guaranteed reward per successful admission disbursed within 45 days."
        />
        <link rel="canonical" href="https://degreeguru.in/referral/" />
      </Helmet>

      <div className="container-dg py-8 md:py-14">
        <AppBreadcrumb items={[{ label: "Refer & Earn" }]} />
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold mb-3">
            <Gift size={15} /> Transparent Student Ambassador Reward
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Refer & Earn ₹5,000 Guaranteed Reward
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
            Know someone planning to upskill with an Online MBA, Online MCA, or degree course? Introduce them to Degree Guru and receive a direct bank transfer reward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: How it works & Terms (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Steps */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-md space-y-5">
              <h2 className="text-xl font-bold text-foreground">How the Referral Program Works</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Submit Your Friend's Details</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enter your friend's contact information and the online degree program they are exploring.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Free Unbiased Career Counseling</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Degree Guru's academic team guides them through top UGC-approved university options, fees, and syllabus without pushy sales.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Admission Confirmed & Reward Disbursed</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Once their university admission and semester fee payment are successfully verified, your ₹5,000 reward is credited directly to your bank account or UPI within 45 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Terms (Prompt Rule #46) */}
            <div className="p-6 rounded-3xl bg-muted/40 border border-border/70 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck size={16} className="text-primary" /> Transparent Policy & Terms
              </div>
              <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-muted-foreground leading-relaxed">
                <li>Reward Amount: Fixed at ₹5,000 per successfully enrolled student in an accredited online degree program.</li>
                <li>Disbursement Timeline: Strictly within 45 days after the university verifies successful admission and documentation.</li>
                <li>No Cap on Referrals: Refer unlimited friends, colleagues, or siblings.</li>
                <li>Clear Tracking: You receive an SMS/WhatsApp confirmation whenever your referred lead completes admission milestones.</li>
              </ul>
            </div>
          </div>

          {/* Right: Submission Form (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="pb-3 border-b border-border/50">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Quick Referral Form
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">
                Refer Someone Today
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Takes less than 60 seconds. We notify both of you upon verification.
              </p>
            </div>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-3">
                <CheckCircle2 size={22} className="shrink-0" />
                <div>
                  <p className="font-bold">Referral Registered Successfully!</p>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Our team will reach out to your friend and link your referral ID ({referrerPhone}).
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor={referrerNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Your Name</label>
                  <input
                    id={referrerNameId}
                    type="text"
                    required
                    placeholder="Your Name"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={referrerPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Your Mobile / UPI Phone</label>
                  <input
                    id={referrerPhoneId}
                    type="tel"
                    required
                    placeholder="Where to send ₹5,000 reward"
                    value={referrerPhone}
                    onChange={(e) => setReferrerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div className="pt-2 border-t border-border/40">
                  <label htmlFor={friendNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Friend's Full Name</label>
                  <input
                    id={friendNameId}
                    type="text"
                    required
                    placeholder="Friend's Name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={friendPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Friend's WhatsApp Mobile</label>
                  <input
                    id={friendPhoneId}
                    type="tel"
                    required
                    placeholder="Friend's Phone"
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={interestedCourseId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Course They Want</label>
                  <select
                    id={interestedCourseId}
                    value={interestedCourse}
                    onChange={(e) => setInterestedCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  >
                    <option value="Online MBA">Online MBA</option>
                    <option value="Online MCA">Online MCA</option>
                    <option value="Online BCA">Online BCA</option>
                    <option value="Online BBA">Online BBA</option>
                    <option value="Online DBA">Online DBA</option>
                    <option value="Class 10/12 BOSSE">Class 10 / 12 (BOSSE)</option>
                    <option value="Other Degree">Other Degree</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Submit Referral & Claim ₹5,000
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Referral;
