import { EAS_GRAPHQL_URL } from "../constants/eas";
import { easService } from "./eas.service";
import { SCHEMAS } from "../constants/schemas";

export class ScoreService {
    async calculateScore(address: string) {
        // Query attestations
        const response = await fetch(EAS_GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                query Attestations($where: AttestationWhereInput) {
                    attestations(where: $where) {
                        id
                        schemaId
                        data
                        time
                        attester
                        recipient
                    }
                }
            `,
                variables: {
                    where: {
                        OR: [
                            { recipient: { equals: address } },
                            { attester: { equals: address } }
                        ]
                    }
                }
            })
        });
        const json = await response.json();
        const attestations = json.data?.attestations || [];

        let liquidityPoints = 0;
        let loanPoints = 0;
        let paymentPoints = 0;
        let agePoints = 0;

        // Calculate age
        if (attestations.length > 0) {
            const firstTime = Math.min(...attestations.map((a: any) => a.time));
            const days = (Date.now() / 1000 - firstTime) / 86400;
            agePoints = Math.min(Math.floor(days * 0.5), 100);
        }

        for (const att of attestations) {
            if (att.schemaId === SCHEMAS.LIQUIDITY_PROVIDER) {
                liquidityPoints = Math.min(liquidityPoints + 100, 300);
            } else if (att.schemaId === SCHEMAS.LOAN_REPAID) {
                loanPoints = Math.min(loanPoints + 150, 450);
            } else if (
                (att.schemaId === SCHEMAS.PAYMENT_RECEIPT ||
                    att.schemaId === SCHEMAS.REMITTANCE_PROOF ||
                    att.schemaId === SCHEMAS.PAYROLL_PROOF) &&
                att.attester.toLowerCase() === address.toLowerCase()
            ) {
                paymentPoints = Math.min(paymentPoints + 25, 150);
            }
        }

        const total = liquidityPoints + loanPoints + paymentPoints + agePoints;
        return {
            total,
            breakdown: { liquidityPoints, loanPoints, paymentPoints, agePoints }
        };
    }

    async createScoreAttestation(address: string, scoreData: any) {
        const encodedData = easService.encodeDeFiScore({
            subject: address,
            score: BigInt(scoreData.total),
            calculatedAt: Math.floor(Date.now() / 1000),
            totalLoans: BigInt(0), // Placeholder
            totalVolume: BigInt(0), // Placeholder
            liquidations: BigInt(0), // Placeholder
            methodologyVersion: "v1.0"
        });
        return easService.createAttestation({
            schemaUID: SCHEMAS.DEFI_SCORE,
            recipient: address,
            data: encodedData
        });
    }
}

export const scoreService = new ScoreService();
