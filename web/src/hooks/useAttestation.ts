import { useState, useCallback } from "react";
import { useEAS } from "./useEAS";
import { easService } from "../services/eas.service";
import { useMerkleTree } from "./useMerkle";
import { MerkleService } from "../services/merkle.service";

export function useAttestation() {
    const { createAttestation: easCreate, getAttestation: easGet, isReady } = useEAS();
    const { buildCredentialTree } = useMerkleTree();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPrivateCredential = useCallback(async (
        recipient: string,
        fields: Record<string, string | number | boolean>,
        description: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const { root, leaves } = await buildCredentialTree(fields);
            const issuedAt = Math.floor(Date.now() / 1000);
            const expiresAt = 0; // No expiration for now

            const encodedData = easService.encodePrivateCredential({
                category: "Personal",
                merkleRoot: root,
                issuedAt,
                expiresAt,
                description
            });

            const { uid, txHash } = await easCreate("PRIVATE_CREDENTIAL", recipient, encodedData);

            // Persist tree metadata
            const metadata = {
                uid,
                root,
                fields,
                leaves
            };
            localStorage.setItem(`credential_${uid}`, JSON.stringify(metadata));

            return { uid, txHash, root };
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create credential");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [easCreate, buildCredentialTree]);

    const createPaymentReceipt = useCallback(async (
        recipient: string,
        data: { payer: string; payee: string; amount: bigint; token: string; paymentType: string; txHash: string; paidAt: number; memo: string }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const encodedData = easService.encodePaymentReceipt(data);
            const result = await easCreate("PAYMENT_RECEIPT", recipient, encodedData);
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create payment receipt");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [easCreate]);

    const createRemittanceProof = useCallback(async (
        recipient: string,
        data: { sender: string; beneficiary: string; amount: bigint; token: string; corridorCode: string; txHash: string; sentAt: number }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const encodedData = easService.encodeRemittanceProof(data);
            const result = await easCreate("REMITTANCE_PROOF", recipient, encodedData);
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create remittance proof");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [easCreate]);

    const createPayrollProof = useCallback(async (
        recipient: string,
        data: { employer: string; employee: string; grossAmount: bigint; netAmount: bigint; token: string; period: string; txHash: string; paidAt: number }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const encodedData = easService.encodePayrollProof(data);
            const result = await easCreate("PAYROLL_PROOF", recipient, encodedData);
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create payroll proof");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [easCreate]);

    const verifyAttestation = useCallback(async (uid: string) => {
        setIsLoading(true);
        try {
            const attestation = await easGet(uid);
            return attestation;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [easGet]);

    const verifyCredentialField = useCallback((
        root: string,
        key: string,
        value: string | number | boolean,
        proof: string[]
    ) => {
        return MerkleService.verifyProof(root, key, value, proof);
    }, []);

    return {
        createPrivateCredential,
        createPaymentReceipt,
        createRemittanceProof,
        createPayrollProof,
        verifyAttestation,
        verifyCredentialField,
        isLoading,
        error,
        isReady
    };
}
