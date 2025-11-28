import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { useAttestation } from "../hooks/useAttestation";
import { useAttestationContext } from "../context/AttestationContext";
import { useWalletContext } from "../context/WalletContext";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { SCHEMAS } from "../constants/schemas";

export default function Payments() {
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const { createPaymentReceipt, createRemittanceProof, createPayrollProof, isLoading: isCreating } = useAttestation();
  const { myAttestations, isLoading: isLoadingHistory, refreshAttestations } = useAttestationContext();
  const { address } = useWalletContext();

  const location = useLocation();
  const initialType = location.state?.type || "Invoice";

  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    token: "USDC",
    paymentType: initialType,
    memo: "",
    txHash: "0x0000000000000000000000000000000000000000000000000000000000000000"
  });

  const handleCreate = async () => {
    try {
      if (!formData.recipient || !formData.amount) {
        toast.error("Missing fields");
        return;
      }
      // Mock token address for Amoy USDC
      const tokenAddress = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";

      if (formData.paymentType === "Remittance") {
        await createRemittanceProof(formData.recipient, {
          sender: address!,
          beneficiary: formData.recipient,
          amount: BigInt(formData.amount),
          token: tokenAddress,
          corridorCode: "US-MX", // Placeholder
          txHash: formData.txHash,
          sentAt: Math.floor(Date.now() / 1000)
        });
      } else if (formData.paymentType === "Payroll") {
        await createPayrollProof(formData.recipient, {
          employer: address!,
          employee: formData.recipient,
          grossAmount: BigInt(formData.amount),
          netAmount: BigInt(formData.amount), // Simplified
          token: tokenAddress,
          period: "2024-M11", // Placeholder
          txHash: formData.txHash,
          paidAt: Math.floor(Date.now() / 1000)
        });
      } else {
        // Default Invoice/Payment Receipt
        await createPaymentReceipt(formData.recipient, {
          payer: address!,
          payee: formData.recipient,
          amount: BigInt(formData.amount),
          token: tokenAddress,
          paymentType: formData.paymentType,
          txHash: formData.txHash,
          paidAt: Math.floor(Date.now() / 1000),
          memo: formData.memo
        });
      }
      toast.success(`${formData.paymentType} attestation created!`);
      refreshAttestations();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to create ${formData.paymentType} attestation`);
    }
  };

  const payments = myAttestations.filter(a =>
    a.schemaId === SCHEMAS.PAYMENT_RECEIPT ||
    a.schemaId === SCHEMAS.REMITTANCE_PROOF ||
    a.schemaId === SCHEMAS.PAYROLL_PROOF
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Payments</h1>
        <p className="text-muted-foreground text-lg">
          Create payment attestations and view your payment history
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create Payment Attestation Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Create Payment Attestation
          </h2>
          <div className="glass-card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Token</label>
                <select
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>USDC</option>
                  <option>USDT</option>
                  <option>DAI</option>
                  <option>POL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Type
              </label>
              <select
                value={formData.paymentType}
                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Invoice</option>
                <option>Remittance</option>
                <option>Payroll</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Memo (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add any additional details..."
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tx Hash (Optional/Placeholder)
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={formData.txHash}
                onChange={(e) => setFormData({ ...formData, txHash: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform disabled:opacity-50">
              {isCreating ? "Creating..." : "Create Payment Proof"}
            </button>
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Payment History</h2>
          <div className="space-y-4">
            {isLoadingHistory ? <p>Loading...</p> : payments.length === 0 ? <p>No payments found.</p> : payments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        To: {payment.recipient.slice(0, 6)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">Verified</p>
                    <div className="text-xs text-secondary">
                      {formatDistanceToNow(new Date(Number(payment.time) * 1000), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment Proof</h2>
                <p className="text-muted-foreground">UID: {selectedPayment.id.slice(0, 8)}...</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">From</p>
                  <p className="font-mono text-sm">{selectedPayment.attester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">To</p>
                  <p className="font-mono text-sm">{selectedPayment.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p>{new Date(Number(selectedPayment.time) * 1000).toLocaleString()}</p>
                </div>
              </div>

              <div className="glass-card p-6 bg-primary/10">
                <p className="text-sm text-muted-foreground mb-2">
                  Attestation UID
                </p>
                <p className="font-mono text-sm break-all">
                  {selectedPayment.id}
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href={`https://polygon-amoy.easscan.org/attestation/view/${selectedPayment.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <ExternalLink size={20} />
                  View on Explorer
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
