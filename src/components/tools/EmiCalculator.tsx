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

  const handleFeeChange = (newFee: number) => {
    setFee(newFee);
    const maxDp = Math.max(0, newFee - 10000);
    if (downPayment > maxDp) {
      setDownPayment(maxDp);
    }
  };

  const tenureOptions = [3, 6, 9, 12, 18, 24, 36];
  const feePresets = [100000, 300000, 750000, 1500000, 2500000, 5000000];
  const maxDownPayment = Math.max(0, fee - 10000);
  const dpStep = fee > 1000000 ? 25000 : (fee > 300000 ? 10000 : 5000);

  return (
    <div className={`w-full bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8 md:p-10"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <Calculator size={13} /> 0% Interest Education EMI Planner
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            EMI Calculator
          </h3>
          <p className="text-xs sm:text-sm text-foreground/75 font-medium mt-0.5">
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
                : "text-foreground/70 hover:text-foreground"
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
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Standard Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Total Course Fee Slider (Till 50 Lakhs) with Manual Fill Up */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                Total Program Fee
              </label>
              
              {/* Manual Fill-up Input */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs font-bold text-primary pointer-events-none">₹</span>
                  <input
                    type="number"
                    min={25000}
                    max={5000000}
                    step={1000}
                    value={fee}
                    onChange={(e) => handleFeeChange(Math.min(5000000, Math.max(0, Number(e.target.value))))}
                    className="w-36 pl-6 pr-2 py-1 bg-background border-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-xs sm:text-sm font-black text-foreground outline-none transition-all shadow-xs"
                    placeholder="Enter fee"
                  />
                </div>
                {fee >= 100000 && (
                  <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                    ({(fee / 100000).toFixed(fee % 100000 === 0 ? 0 : 2)} L)
                  </span>
                )}
              </div>
            </div>

            <input
              type="range"
              min={25000}
              max={5000000}
              step={fee < 500000 ? 5000 : 25000}
              value={fee}
              onChange={(e) => handleFeeChange(Number(e.target.value))}
              className="w-full h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-primary border border-neutral-300/80 dark:border-neutral-600 shadow-inner hover:bg-neutral-400/80 dark:hover:bg-neutral-600 transition-colors"
            />
            <div className="flex justify-between text-[10px] text-foreground/60 font-semibold px-0.5">
              <span>Min: ₹25,000</span>
              <span>Max: ₹50,00,000 (50 Lakhs)</span>
            </div>
          </div>

          {/* Initial Down Payment (Scales with Fee) with Manual Fill Up */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>Down Payment / Initial Deposit</span>
                <span className="text-[10px] font-normal text-foreground/60">(Optional)</span>
              </label>

              {/* Manual Fill-up for Down Payment */}
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-xs font-bold text-muted-foreground pointer-events-none">₹</span>
                <input
                  type="number"
                  min={0}
                  max={maxDownPayment}
                  step={1000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Math.min(maxDownPayment, Math.max(0, Number(e.target.value))))}
                  className="w-32 pl-6 pr-2 py-1 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-xs sm:text-sm font-bold text-foreground outline-none transition-all shadow-xs"
                  placeholder="0"
                />
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={maxDownPayment}
              step={dpStep}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-primary border border-neutral-300/80 dark:border-neutral-600 shadow-inner hover:bg-neutral-400/80 dark:hover:bg-neutral-600 transition-colors"
            />
            <div className="flex justify-between text-[10px] text-foreground/60 font-semibold px-0.5">
              <span>₹0 (Zero Down Payment)</span>
              <span>Max: ₹{maxDownPayment.toLocaleString("en-IN")}</span>
            </div>
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

          {/* If Standard Loan, show Interest Rate (till 30%) */}
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
                min={6}
                max={30}
                step={0.5}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-full appearance-none cursor-pointer accent-primary border border-neutral-300/80 dark:border-neutral-600 shadow-inner hover:bg-neutral-400/80 dark:hover:bg-neutral-600 transition-colors"
              />
              <div className="flex justify-between text-[10px] text-foreground/60 font-semibold px-0.5">
                <span>6% p.a.</span>
                <span>30% p.a.</span>
              </div>
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
              <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-baseline">
                <span>₹{calculations.monthlyEmi.toLocaleString("en-IN")}</span>
              </div>
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
                  {isNoCost ? "0%" : `₹${calculations.totalInterest.toLocaleString("en-IN")}`}
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
