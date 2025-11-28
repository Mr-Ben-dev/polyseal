import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const SCHEMAS = {
    PRIVATE_CREDENTIAL_SCHEMA: {
        name: "Polyseal Private Credential",
        schema: "string category,bytes32 merkleRoot,uint64 issuedAt,uint64 expiresAt,string description",
    },
    PAYMENT_RECEIPT_SCHEMA: {
        name: "Polyseal Payment Receipt",
        schema: "address payer,address payee,uint256 amount,address token,string paymentType,bytes32 txHash,uint64 paidAt,string memo",
    },
    REMITTANCE_PROOF_SCHEMA: {
        name: "Polyseal Remittance Proof",
        schema: "address sender,address beneficiary,uint256 amount,address token,string corridorCode,bytes32 txHash,uint64 sentAt",
    },
    PAYROLL_PROOF_SCHEMA: {
        name: "Polyseal Payroll Proof",
        schema: "address employer,address employee,uint256 grossAmount,uint256 netAmount,address token,string period,bytes32 txHash,uint64 paidAt",
    },
    LOAN_REPAID_SCHEMA: {
        name: "Polyseal Loan Repaid",
        schema: "address borrower,address lender,uint256 principal,uint256 interest,address token,bytes32 loanId,bytes32 txHash,uint64 repaidAt",
    },
    LIQUIDITY_PROVIDER_SCHEMA: {
        name: "Polyseal Liquidity Provider",
        schema: "address provider,address pool,uint256 amount,address token,string action,bytes32 positionId,uint64 timestamp",
    },
    DEFI_SCORE_SCHEMA: {
        name: "Polyseal DeFi Score",
        schema: "address subject,uint256 score,uint64 calculatedAt,uint256 totalLoans,uint256 totalVolume,uint256 liquidations,string methodologyVersion",
    },
};

async function main() {
    const rpcUrl = process.env.POLYGON_AMOY_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS;

    if (!rpcUrl || !privateKey || !schemaRegistryAddress) {
        throw new Error("Missing environment variables");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const schemaRegistry = new SchemaRegistry(schemaRegistryAddress);
    schemaRegistry.connect(signer);

    const deployedSchemas: any = {
        network: "polygon-amoy",
        schemaRegistry: schemaRegistryAddress,
        schemas: {},
    };

    for (const [key, value] of Object.entries(SCHEMAS)) {
        console.log(`Registering ${value.name}...`);
        try {
            const transaction = await schemaRegistry.register({
                schema: value.schema,
                resolverAddress: ethers.ZeroAddress,
                revocable: true,
            });

            // Wait for transaction to be mined
            const uid = await transaction.wait();
            console.log(`Registered ${value.name} with UID: ${uid}`);

            deployedSchemas.schemas[key] = {
                name: value.name,
                schema: value.schema,
                uid: uid,
            };
        } catch (error) {
            console.error(`Failed to register ${value.name}:`, error);
            // If it fails, it might be because it's already registered or some other error.
            // But for this task, we want to ensure we get UIDs.
            // If it fails, we might want to try to find the existing UID if possible, but the SDK doesn't easily support that without querying.
            // However, since we are using a fresh deployer key, we assume we are registering new ones.
            // If the schema string is identical, EAS might return the existing UID without erroring?
            // Actually, EAS registry allows registering the same schema string again? No, it's content addressed usually.
            // If it's content addressed, registering again should return the same UID or revert?
            // Let's assume it works or we handle it.
            process.exit(1);
        }
    }

    const outputPath = path.join(__dirname, "../deployed-schemas.json");
    fs.writeFileSync(outputPath, JSON.stringify(deployedSchemas, null, 2));
    console.log(`Wrote deployed schemas to ${outputPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
