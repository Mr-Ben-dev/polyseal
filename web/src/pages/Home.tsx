import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  FileCheck,
  TrendingUp,
  Zap,
  Users,
  Code,
  Lock,
  DollarSign,
  Network,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-float"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            {...fadeInUp}
          >
            <span className="text-gradient-primary">Polyseal</span>
            <br />
            <span className="text-foreground">
              Self-Sovereign Identity and Payment Trust Layer
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Private credentials, verifiable payments, and DeFi reputation,
            portable across the Polygon ecosystem.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-full btn-glow hover:scale-105 transition-transform duration-200 text-lg"
            >
              Launch App
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 glass-card border-primary/50 font-semibold rounded-full hover:scale-105 transition-transform duration-200 text-lg"
            >
              Read How It Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* Wave 3 Breakthrough Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="glass-card p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient-primary">
              Wave 3 Breakthrough
            </h2>
            <p className="text-2xl mb-12 text-foreground">
              Privacy and Payments Revolution
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    From EAS Toolkit to Complete Trust Layer
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Polyseal evolved from a simple attestation explorer to a
                    comprehensive identity and payment verification system.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary">
                    Merkle-Root Attestations with Selective Disclosure
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Store only cryptographic commitments on-chain. Users control
                    what they reveal, when they reveal it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    Zero-Knowledge Privacy for Mainstream Users
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Prove age, KYC status, or income without exposing raw data.
                    Privacy-preserving verification for everyone.
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 border-primary/30">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lock className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">User Data</p>
                      <p className="text-sm text-muted-foreground">
                        Sensitive information
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Network className="text-secondary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Merkle Tree</p>
                      <p className="text-sm text-muted-foreground">
                        Cryptographic commitment
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Merkle Root On-Chain</p>
                      <p className="text-sm text-muted-foreground">
                        Verifiable proof
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <FileCheck className="text-secondary" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">Selective Disclosure</p>
                      <p className="text-sm text-muted-foreground">
                        User-controlled sharing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Core Features
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Lock size={32} />}
              title="Private Data Credentials"
              description="Encode sensitive information into Merkle roots, reveal only selected fields, zero-knowledge inspired privacy."
            />
            <FeatureCard
              icon={<DollarSign size={32} />}
              title="Payment Attestations"
              description="PaymentReceipt, RemittanceProof, and PayrollProof schemas turn USDC transfers into verifiable receipts."
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="DeFi Reputation System"
              description="LiquidityProvider history, LoanRepaid records, and risk scores that protocols can query."
            />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={<Zap size={32} />}
              title="Katana Integration"
              description="Unified reputation combining Polygon and Katana activity into one identity profile."
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Multi-Wallet Support"
              description="MetaMask, Rainbow, Coinbase, WalletConnect with seamless network switching."
            />
            <FeatureCard
              icon={<Code size={32} />}
              title="Developer SDK"
              description="TypeScript library and React components for instant attestation verification in any dApp."
            />
          </motion.div>
        </div>
      </section>

      {/* Real Impact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Real Impact
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <ImpactCard
              title="User Sovereignty"
              stat="100%"
              description="Users control identity without centralized databases."
            />
            <ImpactCard
              title="DeFi Trust"
              stat="Infinite"
              description="DeFi protocols assess risk using verifiable credentials."
            />
            <ImpactCard
              title="Payment Privacy"
              stat="Complete"
              description="Stablecoin payments gain trust without surveillance."
            />
          </div>

          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Polyseal creates a trust rail for the AggLayer, enabling
              cross-chain reputation that follows users everywhere. Your
              attestations on Polygon become credentials on Katana, unlocking
              seamless multi-chain DeFi experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Polyseal Wins Section */}
      <section className="py-20 px-4 mb-20">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Polyseal Wins
          </motion.h2>

          <motion.div
            className="glass-card p-8 md:p-12 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-lg">
                  <strong className="text-primary">
                    Bridges privacy and verification.
                  </strong>{" "}
                  Traditional identity systems force you to choose between
                  privacy and trust. Polyseal gives you both.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                <p className="text-lg">
                  <strong className="text-secondary">
                    Hides complexity of blockchain for mainstream users.
                  </strong>{" "}
                  No gas fees, no wallet confusion. Just credentials that work.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-lg">
                  <strong className="text-primary">
                    Turns isolated DeFi actions into portable reputation.
                  </strong>{" "}
                  Every payment, every loan, every liquidity provision becomes
                  part of your verifiable history.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border/30">
              <div className="glass-card p-8 border-primary/30 text-center">
                <h3 className="text-2xl font-bold mb-4 text-gradient-primary">
                  Ready for the future of verifiable everything.
                </h3>
                <p className="text-muted-foreground">
                  Polyseal isn't just for today's DeFi. It's infrastructure for
                  tomorrow's trust economy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ImpactCard({
  title,
  stat,
  description,
}: {
  title: string;
  stat: string;
  description: string;
}) {
  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-5xl font-bold text-gradient-primary mb-2">
        {stat}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
