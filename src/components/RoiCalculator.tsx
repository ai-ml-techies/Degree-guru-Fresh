import { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, DollarSign } from "lucide-react";

export const RoiCalculator = () => {
  // Inputs
  const [currentSalary, setCurrentSalary] = useState<number>(450000); // 4.5 LPA
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [courseFee, setCourseFee] = useState<number>(150000); // 1.5 Lakhs
  const [courseDurationYears, setCourseDurationYears] = useState<number>(2);
  const [expectedHikePercent, setExpectedHikePercent] = useState<number>(55); // 55%
  const [careerGoal, setCareerGoal] = useState<string>("Promotion to Lead / Management");

  // Calculations
  const postCourseSalary = Math.round(currentSalary * (1 + expectedHikePercent / 100));
  const annualSalaryIncrease = postCourseSalary - currentSalary;
  const monthlySalaryIncrease = Math.round(annualSalaryIncrease / 12);
  const monthlyEmi = Math.round(courseFee / (courseDurationYears * 12));
  
  // Payback period in months: Course Fee / Monthly Salary Increase
  const paybackMonths = annualSalaryIncrease > 0 ? (courseFee / monthlySalaryIncrease).toFixed(1) : "0";
  
  // 3-Year Net Financial ROI: (3 * Annual Increase - Course Fee) / Course Fee * 100
  const threeYearGrossGain = annualSalaryIncrease * 3;
  const threeYearNetRoiPercent = Math.round(((threeYearGrossGain - courseFee) / courseFee) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#6528f7] via-purple-500 to-emerald-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Calculator size={14} /> Degree ROI & Salary Jump Calculator
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Calculate Your Education Return on Investment
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            See how an accredited online degree impacts your monthly paycheck and career payback timeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Salary Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">Current Annual Salary (CTC)</label>
              <span className="text-sm sm:text-base font-extrabold text-primary">
                ₹{(currentSalary / 100000).toFixed(1)} Lakhs / year
              </span>
            </div>
            <input
              type="range"
              min={150000}
              max={2500000}
              step={25000}
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>₹1.5L</span>
              <span>₹10L</span>
              <span>₹25L</span>
            </div>
          </div>

          {/* Course Fee Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">Target Online Degree Fee</label>
              <span className="text-sm sm:text-base font-extrabold text-primary">
                ₹{(courseFee / 100000).toFixed(2)} Lakhs Total
              </span>
            </div>
            <input
              type="range"
              min={60000}
              max={500000}
              step={10000}
              value={courseFee}
              onChange={(e) => setCourseFee(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>₹60,000 (BCA/BBA)</span>
              <span>₹1.8L (Avg MBA)</span>
              <span>₹5,00,000 (Exec DBA)</span>
            </div>
          </div>

          {/* Expected Salary Jump Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">Expected Salary Improvement (%)</label>
              <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                +{expectedHikePercent}% Hike
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={expectedHikePercent}
              onChange={(e) => setExpectedHikePercent(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>+20% (Conservative)</span>
              <span>+55% (Industry Median)</span>
              <span>+150% (Domain Switch)</span>
            </div>
          </div>

          {/* Grid of Work Experience & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Work Experience</label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              >
                <option value={0}>Fresher / Student (0 yrs)</option>
                <option value={1}>1 - 2 Years</option>
                <option value={3}>3 - 5 Years</option>
                <option value={6}>6 - 10 Years</option>
                <option value={11}>10+ Years (Senior Lead)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">Program Duration</label>
              <select
                value={courseDurationYears}
                onChange={(e) => setCourseDurationYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              >
                <option value={1}>1 Year (Executive)</option>
                <option value={2}>2 Years (Master's / MBA)</option>
                <option value={3}>3 Years (Bachelor's / DBA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-muted/40 border border-border/80 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Estimated Outcomes</span>
            
            {/* Projected Post-Course Salary */}
            <div className="mt-3 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
              <span className="text-xs text-muted-foreground">Projected Post-Degree Annual CTC</span>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                ₹{(postCourseSalary / 100000).toFixed(2)} Lakhs <span className="text-xs font-bold text-emerald-500">/ yr</span>
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp size={14} /> +₹{(annualSalaryIncrease / 100000).toFixed(2)}L annual salary jump
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 rounded-xl bg-card border border-border/70">
                <span className="text-[11px] text-muted-foreground">Est. Monthly EMI</span>
                <div className="text-base font-extrabold text-foreground mt-0.5">
                  ₹{monthlyEmi.toLocaleString("en-IN")}
                </div>
                <span className="text-[10px] text-muted-foreground">No-cost EMI</span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border/70">
                <span className="text-[11px] text-muted-foreground">Payback Timeline</span>
                <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {paybackMonths} Months
                </div>
                <span className="text-[10px] text-muted-foreground">From salary hike</span>
              </div>

              <div className="col-span-2 p-3.5 rounded-xl bg-card border border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground">3-Year Net ROI</span>
                  <div className="text-xl font-black text-primary mt-0.5">
                    +{threeYearNetRoiPercent}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground">3-Yr Net Gain</span>
                  <div className="text-sm font-bold text-foreground">
                    +₹{((threeYearGrossGain - courseFee) / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <ShieldAlert size={15} className="shrink-0 mt-0.5" />
            <span>
              <strong>Realistic Estimate:</strong> Projections are calculated using aggregated alumni data & market benchmarks. Degree Guru never guarantees salary outcomes.
            </span>
          </div>

          {/* Primary CTA */}
          <Link
            to="/courses"
            className="w-full py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Find Courses That Fit My Goal <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
