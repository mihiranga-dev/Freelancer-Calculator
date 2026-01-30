import { useState } from "react";
import { useCurrencies, useCalculate, useHistory } from "@/hooks/use-calculator";
import { Button, Card, Input, Select, cn } from "@/components/ui-elements";
import { ResultBreakdown } from "@/components/ResultBreakdown";
import { motion, AnimatePresence } from "framer-motion";
import { History, TrendingUp, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("LKR");
  const [result, setResult] = useState<any>(null);

  const { data: currenciesData, isLoading: isLoadingCurrencies } = useCurrencies();
  const { mutate: calculate, isPending: isCalculating } = useCalculate();
  const { data: historyData } = useHistory();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    calculate(
      { amount: Number(amount), targetCurrency: currency },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      }
    );
  };

  // Transform currency data for select input
  const currencyOptions = currenciesData?.rates 
    ? Object.keys(currenciesData.rates).map(code => ({ value: code, label: code }))
    : [{ value: "LKR", label: "LKR (Default)" }, { value: "EUR", label: "EUR" }, { value: "INR", label: "INR" }];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4"
          >
            <TrendingUp className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
          >
            Freelancer Income Calculator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Calculate your true take-home earnings from Fiverr projects. Instantly subtract fees and convert to your local currency.
          </motion.p>
        </div>

        {/* Main Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="space-y-8 border-t border-t-white/10">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="Project Price (USD)"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="font-display text-xl"
                  />

                  <Select
                    label="Target Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={currencyOptions}
                    disabled={isLoadingCurrencies}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg h-14 bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 shadow-lg shadow-primary/20"
                  isLoading={isCalculating}
                >
                  {isCalculating ? "Crunching Numbers..." : "Calculate Earnings"}
                </Button>
              </form>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Calculations
                </h4>
                <div className="space-y-3">
                  <AnimatePresence>
                    {historyData?.slice(0, 3).map((item: any) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-white/5 transition-colors cursor-default group"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">${Number(item.projectPrice).toFixed(0)} USD</span>
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">→</span>
                          <span className="font-display font-bold text-primary group-hover:scale-105 transition-transform">
                            {new Intl.NumberFormat(undefined, { style: 'currency', currency: item.targetCurrency }).format(Number(item.finalAmount))}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {!historyData?.length && (
                      <p className="text-sm text-muted-foreground/50 italic py-2">No history yet.</p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ResultBreakdown data={result} isLoading={isCalculating} />
            
            {/* Info Box */}
            <div className="mt-8 p-6 rounded-2xl bg-secondary/20 border border-white/5 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-foreground mb-2">How it works</h4>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Fiverr takes a flat <strong>20% fee</strong> from every order.</li>
                <li>We fetch real-time exchange rates for accuracy.</li>
                <li>The final amount is what lands in your local bank account (excluding bank transfer fees).</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
