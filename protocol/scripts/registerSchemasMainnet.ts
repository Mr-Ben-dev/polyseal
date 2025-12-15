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

// Polygon Mainnet EAS addresses (CORRECT - different from Ethereum Mainnet!)
const MAINNET_SCHEMA_REGISTRY = "0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7";
const MAINNET_EAS_CONTRACT = "0xd624943e0dd7fcd204026f5e8e4d29773998c1aa";
const MAINNET_RPC = "https://polygon-rpc.com";

async function main() {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY environment variable");
    }

    console.log("Connecting to Polygon Mainnet...");
    const provider = new ethers.JsonRpcProvider(MAINNET_RPC);
    const signer = new ethers.Wallet(privateKey, provider);

    const balance = await provider.getBalance(signer.address);
    console.log(`Deployer address: ${signer.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} MATIC`);

    const schemaRegistry = new SchemaRegistry(MAINNET_SCHEMA_REGISTRY);
    schemaRegistry.connect(signer);

    const deployedSchemas: any = {
        network: "polygon-mainnet",
        chainId: 137,
        schemaRegistry: MAINNET_SCHEMA_REGISTRY,
        easContract: MAINNET_EAS_CONTRACT,
        deployedAt: new Date().toISOString(),
        schemas: {},
    };

    for (const [key, value] of Object.entries(SCHEMAS)) {
        console.log(`\nRegistering ${value.name}...`);
        try {
            const transaction = await schemaRegistry.register({
                schema: value.schema,
                resolverAddress: ethers.ZeroAddress,
                revocable: true,
            });

            const uid = await transaction.wait();
            console.log(`✅ Registered ${value.name} with UID: ${uid}`);

            deployedSchemas.schemas[key] = {
                name: value.name,
                schema: value.schema,
                uid: uid,
            };
        } catch (error: any) {
            console.error(`❌ Failed to register ${value.name}:`, error.message);
            // Continue with other schemas
        }
    }

    const outputPath = path.join(__dirname, "../deployed-schemas-mainnet.json");
    fs.writeFileSync(outputPath, JSON.stringify(deployedSchemas, null, 2));
    console.log(`\n✅ Wrote deployed schemas to ${outputPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
