import { useState } from "react";
import { useAttestation } from "./useAttestation";
import { toast } from "react-hot-toast";

export interface BatchPayment {
    recipient: string;
    amount: string;
    token: string;
    memo?: string;
}

export function useBatchAttestation() {
    const { createPaymentReceipt, isLoading: isSingleLoading } = useAttestation();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    const createBatchPayments = async (payments: BatchPayment[], payerAddress: string) => {
        setIsLoading(true);
        setProgress({ current: 0, total: payments.length });

        const results: { success: boolean; uid?: string; error?: string }[] = [];

        for (let i = 0; i < payments.length; i++) {
            const payment = payments[i];
            setProgress({ current: i + 1, total: payments.length });

            try {
                const tokenAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // USDC on Polygon
                const result = await createPaymentReceipt(payment.recipient, {
                    payer: payerAddress,
                    payee: payment.recipient,
                    amount: BigInt(Math.floor(parseFloat(payment.amount) * 1e6)),
                    token: tokenAddress,
                    paymentType: "BatchPayment",
                    txHash: "0x" + "0".repeat(64),
                    paidAt: Math.floor(Date.now() / 1000),
                    memo: payment.memo || `Batch payment ${i + 1}/${payments.length}`
                });
                results.push({ success: true, uid: result?.uid });
            } catch (error: any) {
                results.push({ success: false, error: error.message });
            }
        }

        setIsLoading(false);

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        if (successCount === payments.length) {
            toast.success(`All ${successCount} payments attested successfully!`);
        } else if (successCount > 0) {
            toast.success(`${successCount} payments attested, ${failCount} failed`);
        } else {
            toast.error("All payments failed");
        }

        return results;
    };

    // Estimate gas savings
    const estimateGasSavings = (count: number) => {
        // Single tx gas: ~100,000
        // Batch overhead: ~30,000 per additional
        const singleGas = 100000 * count;
        const batchGas = 100000 + (count - 1) * 30000;
        const savings = ((singleGas - batchGas) / singleGas) * 100;
        return Math.round(savings);
    };

    return {
        createBatchPayments,
        isLoading,
        progress,
        estimateGasSavings,
    };
}
