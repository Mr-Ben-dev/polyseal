import { motion } from "framer-motion";
import { Shield, FileCheck, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useWalletContext } from "../context/WalletContext";
import { useAttestationContext } from "../context/AttestationContext";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { address, isConnected, chainId } = useWalletContext();
  const { myAttestations, isLoading } = useAttestationContext();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Polyseal</h1>
        <p className="text-xl text-muted-foreground mb-8">Connect your wallet to manage your identity and reputation.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="glass-card px-4 py-2 rounded-full">
            <span className="text-sm text-muted-foreground">Wallet: </span>
            <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold">
              {chainId === 80002 ? "Polygon Amoy" : "Unknown Network"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          to="/create"
          className="glass-card p-6 hover:border-primary/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create Credential</h3>
              <p className="text-sm text-muted-foreground">
                Issue new attestation
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/payments"
          className="glass-card p-6 hover:border-primary/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <FileCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create Payment Proof</h3>
              <p className="text-sm text-muted-foreground">
                Verify transaction
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/defi-score"
          className="glass-card p-6 hover:border-primary/50 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">View DeFi Score</h3>
              <p className="text-sm text-muted-foreground">
                Check reputation
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* My Attestations */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">My Attestations</h2>
          <div className="space-y-4">
            {isLoading ? (
              <p>Loading attestations...</p>
            ) : myAttestations.length === 0 ? (
              <p>No attestations found.</p>
            ) : (
              myAttestations.map((attestation, index) => (
                <motion.div
                  key={attestation.id}
                  className="glass-card p-6 hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Attestation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        UID: {attestation.id.slice(0, 10)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                      <CheckCircle size={16} />
                      <span className="text-sm font-semibold">
                        Valid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>{formatDistanceToNow(new Date(attestation.time * 1000), { addSuffix: true })}</span>
                  </div>
                </motion.div>
              )))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
