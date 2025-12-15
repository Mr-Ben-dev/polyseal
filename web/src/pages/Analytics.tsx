import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, FileCheck, DollarSign, Shield, Activity } from "lucide-react";
import { analyticsService, AnalyticsData } from "../services/analytics.service";
import { useWalletContext } from "../context/WalletContext";
import { CHAIN_ID } from "../constants/eas";
import { toast } from "react-hot-toast";

export default function Analytics() {
    const { address } = useWalletContext();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (address) {
            loadAnalytics();
        }
    }, [address]);

    const loadAnalytics = async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            const data = await analyticsService.getAnalytics(address);
            setAnalytics(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load analytics");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!analytics) return;
        const csv = analyticsService.exportToCSV(analytics);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `polyseal-analytics-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully!");
    };

    const maxTrend = analytics ? Math.max(...analytics.weeklyTrend, 1) : 1;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Analytics</h1>
                        <p className="text-muted-foreground text-lg">
                            Track your attestation metrics and activity
                        </p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                            <Activity size={14} />
                            {CHAIN_ID === 137 ? "Polygon Mainnet" : "Polygon Amoy Testnet"}
                        </div>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        disabled={!analytics}
                        className="px-6 py-3 glass-card hover:border-primary/50 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download size={20} />
                        Export CSV
                    </button>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="text-center py-20">Loading analytics...</div>
            ) : !analytics ? (
                <div className="text-center py-20 text-muted-foreground">
                    Connect your wallet to view analytics
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid md:grid-cols-4 gap-6 mb-12"
                    >
                        <StatCard
                            icon={<FileCheck size={24} />}
                            label="Total Attestations"
                            value={analytics.totalAttestations.toString()}
                            color="primary"
                        />
                        <StatCard
                            icon={<Shield size={24} />}
                            label="Credentials"
                            value={analytics.attestationsByType["Private Credential"].toString()}
                            color="secondary"
                        />
                        <StatCard
                            icon={<DollarSign size={24} />}
                            label="Payments"
                            value={(
                                analytics.attestationsByType["Payment Receipt"] +
                                analytics.attestationsByType["Remittance"] +
                                analytics.attestationsByType["Payroll"]
                            ).toString()}
                            color="primary"
                        />
                        <StatCard
                            icon={<TrendingUp size={24} />}
                            label="DeFi Activity"
                            value={(
                                analytics.attestationsByType["DeFi Score"] +
                                analytics.attestationsByType["Liquidity"] +
                                analytics.attestationsByType["Loan Repaid"]
                            ).toString()}
                            color="secondary"
                        />
                    </motion.div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Weekly Trend */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-8"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BarChart3 className="text-primary" size={24} />
                                Weekly Activity
                            </h2>
                            <div className="flex items-end justify-between h-48 gap-2">
                                {analytics.weeklyTrend.map((count, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <motion.div
                                            className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(count / maxTrend) * 100}%` }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                            style={{ minHeight: count > 0 ? "8px" : "0" }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Attestation Types */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-8"
                        >
                            <h2 className="text-xl font-bold mb-6">Attestation Breakdown</h2>
                            <div className="space-y-4">
                                {Object.entries(analytics.attestationsByType).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <span className="text-muted-foreground">{type}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(count / Math.max(analytics.totalAttestations, 1)) * 100
                                                            }%`,
                                                    }}
                                                    transition={{ delay: 0.5, duration: 0.5 }}
                                                />
                                            </div>
                                            <span className="font-bold w-8 text-right">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-8 mt-8"
                    >
                        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {analytics.recentActivity.slice(0, 5).map((att, i) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {att.id.slice(0, 8)}...{att.id.slice(-6)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(Number(att.time) * 1000).toLocaleString()}
                                        </p>
                                    </div>
                                    <a
                                        href={`${CHAIN_ID === 137 ? "https://polygon.easscan.org" : "https://polygon-amoy.easscan.org"}/attestation/view/${att.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "primary" | "secondary";
}) {
    return (
        <motion.div
            className="glass-card p-6"
            whileHover={{ scale: 1.02 }}
        >
            <div className={`w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center text-${color} mb-4`}>
                {icon}
            </div>
            <p className="text-3xl font-bold text-gradient-primary">{value}</p>
            <p className="text-muted-foreground text-sm">{label}</p>
        </motion.div>
    );
}
