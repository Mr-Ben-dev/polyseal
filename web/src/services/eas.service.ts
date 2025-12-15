import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, ethers } from "ethers";
import { EAS_CONTRACT_ADDRESS } from "../constants/eas";

export class EASService {
    private eas: EAS;
    private signer: ethers.Signer | null = null;
    private provider: BrowserProvider | null = null;

    constructor() {
        this.eas = new EAS(EAS_CONTRACT_ADDRESS);
    }

    async init(): Promise<boolean> {
        if (!window.ethereum) {
            console.error("No ethereum provider found");
            return false;
        }

        try {
            this.provider = new BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            // IMPORTANT: connect() returns a NEW connected instance, we must reassign
            this.eas = this.eas.connect(this.signer) as EAS;
            console.log("EAS Service initialized with contract:", EAS_CONTRACT_ADDRESS);
            return true;
        } catch (error) {
            console.error("Failed to init EAS service:", error);
            return false;
        }
    }

    async createAttestation(options: {
        schemaUID: string;
        recipient: string;
        data: string;
        refUID?: string;
        expirationTime?: bigint | number;
    }) {
        if (!this.signer || !this.provider) throw new Error("EAS Service not initialized");

        const { schemaUID, recipient, data, expirationTime = 0 } = options;
        const refUID = options.refUID || ethers.ZeroHash;

        console.log("Creating attestation with schema:", schemaUID);
        console.log("Recipient:", recipient);
        console.log("Data length:", data.length);

        try {
            // Call attest and get the transaction object
            console.log("Calling eas.attest()...");
            const tx = await this.eas.attest({
                schema: schemaUID,
                data: {
                    recipient,
                    expirationTime: BigInt(expirationTime),
                    revocable: true,
                    refUID,
                    data,
                },
            });

            console.log("eas.attest() returned");
            console.log("tx object keys:", Object.keys(tx));

            // The EAS SDK returns an object with 'receipt' property that's a Promise
            // We need to await it to get the transaction receipt
            const txAny = tx as any;

            // Check if receipt is available (it's a Promise)
            if (txAny.receipt) {
                console.log("Awaiting tx.receipt...");
                const receipt = await txAny.receipt;
                console.log("Receipt received:", receipt);

                // Get transaction hash from receipt
                const txHash = receipt?.hash || receipt?.transactionHash || "";
                console.log("Transaction hash from receipt:", txHash);

                // Get UID - the receipt should contain it or we parse from logs
                let uid = "";

                // Try to get UID from receipt directly
                if (receipt?.logs && receipt.logs.length > 0) {
                    // Parse UID from the Attested event logs
                    const attestedEventTopic = "0x8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b35";
                    const attestedLog = receipt.logs.find((log: any) => log.topics?.[0] === attestedEventTopic);

                    if (attestedLog && attestedLog.topics.length >= 4) {
                        uid = attestedLog.topics[3] || attestedLog.topics[2] || txHash;
                        console.log("Parsed UID from receipt logs:", uid);
                    } else if (receipt.logs[0]?.topics?.length >= 3) {
                        uid = receipt.logs[0].topics[2] || receipt.logs[0].topics[3] || txHash;
                        console.log("Got UID from first log:", uid);
                    }
                }

                // If we still don't have UID, use txHash
                if (!uid) {
                    uid = txHash;
                }

                console.log("Attestation created successfully!");
                console.log("UID:", uid);
                console.log("TX Hash:", txHash);

                return { uid, txHash };
            }

            // Fallback: Try using tx.data which might contain the transaction response
            if (txAny.data?.hash) {
                console.log("Got hash from tx.data.hash");
                const txHash = txAny.data.hash;
                const receipt = await this.provider!.waitForTransaction(txHash, 1, 120000);
                return { uid: txHash, txHash };
            }

            // Last resort: try wait() even though it usually fails
            console.log("Falling back to tx.wait()...");
            const uid = await tx.wait();
            console.log("wait() returned UID:", uid);
            return { uid, txHash: "" };
        } catch (error: any) {
            console.error("EAS Attestation Error:", error);
            throw new Error(error.message || "Failed to create attestation");
        }
    }

    async getAttestation(uid: string) {
        return await this.eas.getAttestation(uid);
    }

    // Encoders
    encodePrivateCredential(input: { category: string; merkleRoot: string; issuedAt: number; expiresAt: number; description: string }) {
        const schemaEncoder = new SchemaEncoder("string category,bytes32 merkleRoot,uint64 issuedAt,uint64 expiresAt,string description");
        return schemaEncoder.encodeData([
            { name: "category", value: input.category, type: "string" },
            { name: "merkleRoot", value: input.merkleRoot, type: "bytes32" },
            { name: "issuedAt", value: input.issuedAt, type: "uint64" },
            { name: "expiresAt", value: input.expiresAt, type: "uint64" },
            { name: "description", value: input.description, type: "string" },
        ]);
    }

    encodePaymentReceipt(input: { payer: string; payee: string; amount: bigint; token: string; paymentType: string; txHash: string; paidAt: number; memo: string }) {
        const schemaEncoder = new SchemaEncoder("address payer,address payee,uint256 amount,address token,string paymentType,bytes32 txHash,uint64 paidAt,string memo");
        return schemaEncoder.encodeData([
            { name: "payer", value: input.payer, type: "address" },
            { name: "payee", value: input.payee, type: "address" },
            { name: "amount", value: input.amount, type: "uint256" },
            { name: "token", value: input.token, type: "address" },
            { name: "paymentType", value: input.paymentType, type: "string" },
            { name: "txHash", value: input.txHash, type: "bytes32" },
            { name: "paidAt", value: input.paidAt, type: "uint64" },
            { name: "memo", value: input.memo, type: "string" },
        ]);
    }

    encodeRemittanceProof(input: { sender: string; beneficiary: string; amount: bigint; token: string; corridorCode: string; txHash: string; sentAt: number }) {
        const schemaEncoder = new SchemaEncoder("address sender,address beneficiary,uint256 amount,address token,string corridorCode,bytes32 txHash,uint64 sentAt");
        return schemaEncoder.encodeData([
            { name: "sender", value: input.sender, type: "address" },
            { name: "beneficiary", value: input.beneficiary, type: "address" },
            { name: "amount", value: input.amount, type: "uint256" },
            { name: "token", value: input.token, type: "address" },
            { name: "corridorCode", value: input.corridorCode, type: "string" },
            { name: "txHash", value: input.txHash, type: "bytes32" },
            { name: "sentAt", value: input.sentAt, type: "uint64" },
        ]);
    }

    encodePayrollProof(input: { employer: string; employee: string; grossAmount: bigint; netAmount: bigint; token: string; period: string; txHash: string; paidAt: number }) {
        const schemaEncoder = new SchemaEncoder("address employer,address employee,uint256 grossAmount,uint256 netAmount,address token,string period,bytes32 txHash,uint64 paidAt");
        return schemaEncoder.encodeData([
            { name: "employer", value: input.employer, type: "address" },
            { name: "employee", value: input.employee, type: "address" },
            { name: "grossAmount", value: input.grossAmount, type: "uint256" },
            { name: "netAmount", value: input.netAmount, type: "uint256" },
            { name: "token", value: input.token, type: "address" },
            { name: "period", value: input.period, type: "string" },
            { name: "txHash", value: input.txHash, type: "bytes32" },
            { name: "paidAt", value: input.paidAt, type: "uint64" },
        ]);
    }

    encodeLoanRepaid(input: { borrower: string; lender: string; principal: bigint; interest: bigint; token: string; loanId: string; txHash: string; repaidAt: number }) {
        const schemaEncoder = new SchemaEncoder("address borrower,address lender,uint256 principal,uint256 interest,address token,bytes32 loanId,bytes32 txHash,uint64 repaidAt");
        return schemaEncoder.encodeData([
            { name: "borrower", value: input.borrower, type: "address" },
            { name: "lender", value: input.lender, type: "address" },
            { name: "principal", value: input.principal, type: "uint256" },
            { name: "interest", value: input.interest, type: "uint256" },
            { name: "token", value: input.token, type: "address" },
            { name: "loanId", value: input.loanId, type: "bytes32" },
            { name: "txHash", value: input.txHash, type: "bytes32" },
            { name: "repaidAt", value: input.repaidAt, type: "uint64" },
        ]);
    }

    encodeLiquidityProvider(input: { provider: string; pool: string; amount: bigint; token: string; action: string; positionId: string; timestamp: number }) {
        const schemaEncoder = new SchemaEncoder("address provider,address pool,uint256 amount,address token,string action,bytes32 positionId,uint64 timestamp");
        return schemaEncoder.encodeData([
            { name: "provider", value: input.provider, type: "address" },
            { name: "pool", value: input.pool, type: "address" },
            { name: "amount", value: input.amount, type: "uint256" },
            { name: "token", value: input.token, type: "address" },
            { name: "action", value: input.action, type: "string" },
            { name: "positionId", value: input.positionId, type: "bytes32" },
            { name: "timestamp", value: input.timestamp, type: "uint64" },
        ]);
    }

    encodeDeFiScore(input: { subject: string; score: bigint; calculatedAt: number; totalLoans: bigint; totalVolume: bigint; liquidations: bigint; methodologyVersion: string }) {
        const schemaEncoder = new SchemaEncoder("address subject,uint256 score,uint64 calculatedAt,uint256 totalLoans,uint256 totalVolume,uint256 liquidations,string methodologyVersion");
        return schemaEncoder.encodeData([
            { name: "subject", value: input.subject, type: "address" },
            { name: "score", value: input.score, type: "uint256" },
            { name: "calculatedAt", value: input.calculatedAt, type: "uint64" },
            { name: "totalLoans", value: input.totalLoans, type: "uint256" },
            { name: "totalVolume", value: input.totalVolume, type: "uint256" },
            { name: "liquidations", value: input.liquidations, type: "uint256" },
            { name: "methodologyVersion", value: input.methodologyVersion, type: "string" },
        ]);
    }

    decode(schemaString: string, data: string) {
        const schemaEncoder = new SchemaEncoder(schemaString);
        return schemaEncoder.decodeData(data);
    }
}

export const easService = new EASService();
