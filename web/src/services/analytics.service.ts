import { EAS_GRAPHQL_URL } from "../constants/eas";
import { SCHEMAS } from "../constants/schemas";

export interface AnalyticsData {
    totalAttestations: number;
    attestationsByType: Record<string, number>;
    totalVolume: bigint;
    recentActivity: any[];
    weeklyTrend: number[];
}

export class AnalyticsService {
    async getAnalytics(address: string): Promise<AnalyticsData> {
        const response = await fetch(EAS_GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                query Attestations($where: AttestationWhereInput) {
                    attestations(where: $where, orderBy: { time: desc }, take: 100) {
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

        // Count by type
        const attestationsByType: Record<string, number> = {
            "Private Credential": 0,
            "Payment Receipt": 0,
            "Remittance": 0,
            "Payroll": 0,
            "DeFi Score": 0,
            "Liquidity": 0,
            "Loan Repaid": 0,
        };

        for (const att of attestations) {
            if (att.schemaId === SCHEMAS.PRIVATE_CREDENTIAL) attestationsByType["Private Credential"]++;
            else if (att.schemaId === SCHEMAS.PAYMENT_RECEIPT) attestationsByType["Payment Receipt"]++;
            else if (att.schemaId === SCHEMAS.REMITTANCE_PROOF) attestationsByType["Remittance"]++;
            else if (att.schemaId === SCHEMAS.PAYROLL_PROOF) attestationsByType["Payroll"]++;
            else if (att.schemaId === SCHEMAS.DEFI_SCORE) attestationsByType["DeFi Score"]++;
            else if (att.schemaId === SCHEMAS.LIQUIDITY_PROVIDER) attestationsByType["Liquidity"]++;
            else if (att.schemaId === SCHEMAS.LOAN_REPAID) attestationsByType["Loan Repaid"]++;
        }

        // Weekly trend (mock for now - would need historical data)
        const now = Math.floor(Date.now() / 1000);
        const weekAgo = now - 7 * 24 * 60 * 60;
        const weeklyTrend = [0, 0, 0, 0, 0, 0, 0];

        for (const att of attestations) {
            const time = Number(att.time);
            if (time >= weekAgo) {
                const dayIndex = Math.floor((now - time) / (24 * 60 * 60));
                if (dayIndex >= 0 && dayIndex < 7) {
                    weeklyTrend[6 - dayIndex]++;
                }
            }
        }

        return {
            totalAttestations: attestations.length,
            attestationsByType,
            totalVolume: BigInt(0), // Would need to decode data
            recentActivity: attestations.slice(0, 10),
            weeklyTrend,
        };
    }

    exportToCSV(data: AnalyticsData): string {
        let csv = "Type,Count\n";
        for (const [type, count] of Object.entries(data.attestationsByType)) {
            csv += `${type},${count}\n`;
        }
        csv += `\nTotal,${data.totalAttestations}\n`;
        csv += `\nWeekly Trend (Last 7 Days)\n`;
        csv += `Day,Count\n`;
        data.weeklyTrend.forEach((count, i) => {
            csv += `Day ${i + 1},${count}\n`;
        });
        return csv;
    }
}

export const analyticsService = new AnalyticsService();
