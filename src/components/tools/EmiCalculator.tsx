import { useState, useMemo } from "react";
import { 
  Calculator, 
  IndianRupee, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  Sparkles,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import { useLeadGate } from "@/context/LeadGateContext";

interface EmiCalculatorProps {
  initialFee?: number;
  initialTenure?: number;
  compact?: boolean;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  initialFee = 120000,
  initialTenure = 12,
  compact = false,
}) => {
  const { requireContact } = useLeadGate();

  // State
  const [fee, setFee] = useState<number>(initialFee);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(initialTenure);
  const [isNoCost, setIsNoCost] = useState<boolean>(true);
  const [interestRate, setInterestRate] = useState<number>(10.5); // % per annum if not no-cost

  // Calculations
  const calculations = useMemo(() => {
    const loanAmount = Math.max(0, fee - downPayment);
    if (loanAmount <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayable: fee, loanAmount: 0 };
    }

    if (isNoCost) {
      const emi = Math.round(loanAmount / tenure);
      return {
        monthlyEmi: emi,
        totalInterest: 0,
        totalPayable: fee,
        loanAmount,
      };
    } else {
      const monthlyRate = interestRate / 12 / 100;
      const emi = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
          (Math.pow(1 + monthlyRate, tenure) - 1)
      );
      const totalPayable = emi * tenure + downPayment;
      const totalInterest = Math.max(0, totalPayable - fee);
      return {
        monthlyEmi: emi,
        totalInterest,
        totalPayable,
        loanAmount,
      };
    }
  }, [fee, downPayment, tenure, isNoCost, interestRate]);

  const handleApplyEmi = () => {
    requireContact(
      () => {
        const text = encodeURIComponent(
          `Hi Degree Guru, I checked the 0% EMI Calculator for Course Fee ₹${fee.toLocaleString("en-IN")} (Tenure: ${tenure} months, EMI ~₹${calculations.monthlyEmi.toLocaleString("en-IN")}/mo). Please assist me with no-cost EMI pre-approval.`
        );
        window.open(`https://wa.me/919350199001?text=${text}`, "_blank");
      },
      "0% No-Cost EMI Assistance",
      true // Mandatory for tool!
    );
  };

  const tenureOptions = [3, 6, 9, 12, 18, 24, 36];
  const feePresets = [60000, 95000, 130000, 180000, 250000];

  return (
    <div className={`w-full bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8 md:p-10"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <Calculator size={13} /> 0% Interest Education EMI Planner
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Online Degree Fee & EMI Calculator
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Estimate affordable monthly installments for UGC-approved online degrees with zero hidden interest.
          </p>
        </div>

        {/* 0% No-Cost Toggle */}
        <div className="flex items-center gap-2.5 bg-muted/60 p-1.5 rounded-2xl border border-border self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsNoCost(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isNoCost
                ? "bg-amber-500 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={13} /> 0% No-Cost EMI
          </button>
          <button
            type="button"
            onClick={() => setIsNoCost(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isNoCost
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Standard Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Total Course Fee Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                Total Program Fee
              </label>
              <div className="text-base sm:text-lg font-black text-primary flex items-center">
                <span>₹{fee.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <input
              type="range"
              min={30000}
              max={350000}
              step={5000}
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-muted-foreground font-semibold mr-1">Quick Select:</span>
              {feePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFee(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    fee === preset
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  ₹{(preset / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Initial Down Payment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>Down Payment / Initial Deposit</span>
                <span className="text-[10px] font-normal text-muted-foreground">(Optional)</span>
              </label>
              <div className="text-sm font-bold text-foreground">
                ₹{downPayment.toLocaleString("en-IN")}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={Math.min(50000, fee - 10000)}
              step={2000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Loan Tenure in Months */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                Repayment Tenure
              </label>
              <div className="text-sm font-bold text-foreground">
                {tenure} Months ({tenure >= 12 ? `${(tenure / 12).toFixed(tenure % 12 === 0 ? 0 : 1)} Years` : "Short-term"})
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {tenureOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenure(t)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all ${
                    tenure === t
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {t} M
                </button>
              ))}
            </div>
          </div>

          {/* If Standard Loan, show Interest Rate */}
          {!isNoCost && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-foreground">
                  Annual Interest Rate (%)
                </label>
                <span className="text-sm font-bold text-foreground">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={7.5}
                max={16}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          )}
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-amber-500/5 to-transparent border border-border/80 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Estimated Monthly EMI
              </span>
              {isNoCost && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                  <Percent size={10} /> 0% Interest
                </span>
              )}
            </div>

            {/* Big EMI Highlight */}
            <div className="py-2">
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-baseline gap-1">
                <span>₹{calculations.monthlyEmi.toLocaleString("en-IN")}</span>
                <span className="text-xs font-semibold text-muted-foreground">/ month</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                For {tenure} equal monthly installments with zero hidden processing charges.
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Course Fee</span>
                <span className="font-bold text-foreground">₹{fee.toLocaleString("en-IN")}</span>
              </div>
              {downPayment > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Initial Down Payment</span>
                  <span className="font-bold text-foreground">-₹{downPayment.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Interest Payable</span>
                <span className={`font-bold ${isNoCost ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                  {isNoCost ? "₹0 (100% Free)" : `₹${calculations.totalInterest.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-sm font-black">
                <span className="text-foreground">Total Amount</span>
                <span className="text-primary">₹{calculations.totalPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* CTA Button with Lead Gate */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleApplyEmi}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01]"
            >
              <span>Get 0% EMI Pre-Approval</span>
              <ArrowRight size={15} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
              <span>Approved by LiquiLoans, Eduvanz & GrayQuest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmiCalculator;
