import { motion } from "framer-motion";
import { Droplet, Coins, FileCheck, Calendar, TrendingUp } from "lucide-react";
import { useDeFiScore } from "../hooks/useDeFiScore";
import { toast } from "react-hot-toast";

export default function DefiScore() {
  const { score, breakdown, isLoading, attestScore } = useDeFiScore();

  const handleAttest = async () => {
    try {
      const result = await attestScore();
      if (result) {
        toast.success(
          <div className="flex flex-col gap-2">
            <span>Score attested!</span>
            <a
              href={`https://polygon-amoy.easscan.org/attestation/view/${result.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline font-bold"
            >
              View on Explorer
            </a>
          </div>
        );
      }
    } catch (error) {
      toast.error("Failed to attest score");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">DeFi Score</h1>
        <p className="text-muted-foreground text-lg">
          Your verifiable reputation across DeFi protocols
        </p>
      </motion.div>

      {/* Score Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-12 text-center mb-12"
      >
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              fill="none"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#scoreGradient)"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 120}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 120 * (1 - score / 1000),
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-6xl font-bold text-gradient-primary"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {isLoading ? "..." : score}
            </motion.div>
            <p className="text-muted-foreground text-lg">DeFi Score</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Your score is calculated from your on-chain reputation, payment
          history, and DeFi activity across Polygon and Katana.
        </p>
        <button
          onClick={handleAttest}
          disabled={isLoading || score === 0}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform disabled:opacity-50">
          Export Score as Attestation
        </button>
      </motion.div>

      {/* Score Components */}
      <div className="grid md:grid-cols-2 gap-6">
        <ScoreCard
          icon={<Droplet size={24} />}
          title="Liquidity Provider History"
          score={breakdown?.liquidityPoints || 0}
          maxScore={300}
          description="Your contributions to DeFi liquidity pools"
          details={[
            "Points from verified LP attestations",
          ]}
          delay={0.2}
        />

        <ScoreCard
          icon={<Coins size={24} />}
          title="Loan Repaid"
          score={breakdown?.loanPoints || 0}
          maxScore={450}
          description="Your borrowing and repayment track record"
          details={[
            "Points from verified Loan Repaid attestations",
          ]}
          delay={0.3}
        />

        <ScoreCard
          icon={<FileCheck size={24} />}
          title="Payment Proofs"
          score={breakdown?.paymentPoints || 0}
          maxScore={150}
          description="Verified payment attestations"
          details={[
            "Points from verified Payment Receipts",
          ]}
          delay={0.4}
        />

        <ScoreCard
          icon={<Calendar size={24} />}
          title="Account Age"
          score={breakdown?.agePoints || 0}
          maxScore={100}
          description="Duration of your blockchain activity"
          details={[
            "Based on first attestation time",
          ]}
          delay={0.5}
        />
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-8 mt-12"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              How to Improve Your Score
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Continue providing liquidity to trusted protocols</li>
              <li>• Create payment attestations for all transactions</li>
              <li>• Maintain a perfect loan repayment record</li>
              <li>• Expand your activity across Polygon and Katana</li>
              <li>• Verify your identity with private credentials</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ScoreCard({
  icon,
  title,
  score,
  maxScore,
  description,
  details,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  maxScore: number;
  description: string;
  details: string[];
  delay: number;
}) {
  const percentage = (score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient-primary">
            {score}
          </div>
          <div className="text-sm text-muted-foreground">/ {maxScore}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
          />
        </div>
      </div>

      <ul className="space-y-1">
        {details.map((detail, index) => (
          <li
            key={index}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-primary" />
            {detail}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
