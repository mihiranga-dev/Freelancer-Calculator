import { motion } from "framer-motion";
import { ArrowDown, DollarSign, Wallet, RefreshCw } from "lucide-react";

interface ResultData {
  projectPrice: number;
  feeAmount: number;
  takeHomeUSD: number;
  targetCurrency: string;
  exchangeRate: number;
  finalAmount: number;
}

interface ResultBreakdownProps {
  data: ResultData | null;
  isLoading: boolean;
}

export function ResultBreakdown({ data, isLoading }: ResultBreakdownProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center rounded-2xl bg-secondary/20 border border-white/5 animate-pulse">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p className="text-sm">Calculating earnings...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center rounded-2xl bg-secondary/10 border border-dashed border-white/10">
        <div className="text-center text-muted-foreground">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium opacity-50">Enter amount to calculate</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Primary Result Card */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8 text-center group">
        <div className="absolute inset-0 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
        
        <h3 className="relative text-sm font-medium text-primary uppercase tracking-wider mb-2">
          Your Take Home ({data.targetCurrency})
        </h3>
        <div className="relative text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight">
          {new Intl.NumberFormat(undefined, { style: 'currency', currency: data.targetCurrency }).format(data.finalAmount)}
        </div>
        
        <div className="relative mt-4 inline-flex items-center px-3 py-1 rounded-full bg-background/50 border border-white/10 text-xs text-muted-foreground backdrop-blur-md">
          <RefreshCw className="w-3 h-3 mr-2" />
          Rate: 1 USD = {data.exchangeRate.toFixed(2)} {data.targetCurrency}
        </div>
      </motion.div>

      {/* Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item} className="p-4 rounded-xl bg-card border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs uppercase font-semibold">Project Price</span>
          </div>
          <p className="text-2xl font-display font-semibold text-foreground">
            ${data.projectPrice.toFixed(2)}
          </p>
        </motion.div>

        <motion.div variants={item} className="p-4 rounded-xl bg-card border border-white/5 hover:border-destructive/30 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-destructive/10 blur-xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <ArrowDown className="w-4 h-4 text-destructive" />
            <span className="text-xs uppercase font-semibold">Fiverr Fee (20%)</span>
          </div>
          <p className="text-2xl font-display font-semibold text-destructive">
            -${data.feeAmount.toFixed(2)}
          </p>
        </motion.div>

        <motion.div variants={item} className="p-4 rounded-xl bg-card border border-white/5 hover:border-green-500/30 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 blur-xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Wallet className="w-4 h-4 text-green-500" />
            <span className="text-xs uppercase font-semibold">Net USD</span>
          </div>
          <p className="text-2xl font-display font-semibold text-green-400">
            ${data.takeHomeUSD.toFixed(2)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
