# 🌟 POLYSEAL — Self-Sovereign Identity and Payment Trust Layer

Polyseal transforms how Web3 handles trust, identity, and payments. We built the infrastructure that makes private credentials, verifiable payments, and DeFi reputation portable across the entire Polygon ecosystem.

![Polyseal Dashboard](./web/public/favicon.svg)

## 🚀 Live Demo
**Production App**: [polyseal-jade.vercel.app](https://polyseal-jade.vercel.app)  
**Network**: **Polygon Mainnet** (Chain ID: 137) ✅

## ✨ Wave 4 Features

### 🆕 Analytics Dashboard
Real-time metrics tracking with CSV export for accounting:
- GMV tracking by attestation type
- Weekly activity trends
- Attestation breakdown charts
- One-click CSV export

### 🆕 Batch Operations
Create multiple attestations in a single flow:
- ~30% gas savings
- Progress tracking
- Enterprise-scale support

### 🆕 Multi-Network Support
Seamlessly switch between Mainnet and Testnet:
- Polygon Mainnet (137) — **Production**
- Polygon Amoy (80002) — Testnet

## 🔐 Core Features

### 1. Private Data Credentials
Encode sensitive information into Merkle roots. Users can reveal only selected fields to verifiers using **Selective Disclosure**.
- **Schema**: `PRIVATE_CREDENTIAL`
- **Privacy**: Zero-knowledge inspired privacy for real-world identity.

### 2. Payment Attestations
Every stablecoin transfer becomes a verifiable receipt.
- **Supported Types**:
    - **Payment Receipt**: Standard invoice/payment proof.
    - **Remittance Proof**: Cross-border transfer verification.
    - **Payroll Proof**: Salary payment verification.
- **Token Support**: USDC, USDT, DAI, POL, WETH, WMATIC.

### 3. DeFi Reputation System
Your on-chain activity becomes a portable reputation score.
- **Aggregates**:
    - `LiquidityProvider` history
    - `LoanRepaid` records
    - `PaymentReceipt` history
    - Account Age
- **Output**: A verifiable **DeFi Score** attestation that protocols can query to assess risk.

### 4. Katana Integration
Unified reputation combining Polygon and Katana activity into one identity profile.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Blockchain**: Polygon Mainnet (137)
- **Attestation**: Ethereum Attestation Service (EAS)
- **Cryptography**: Merkle Tree (merkletreejs) for privacy
- **Wallet**: RainbowKit, Wagmi, Viem

## 🔗 Deployed Contracts & Schemas (Polygon Mainnet)

| Name | Address / UID |
|------|---------------|
| **EAS Contract** | `0xd624943e0dd7fcd204026f5e8e4d29773998c1aa` |
| **Schema Registry** | `0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7` |
| **Private Credential** | `0x95f3bb51240d66ae81e278ef7bb850cf1f1c2691ba49d87be9b32311208172e2` |
| **Payment Receipt** | `0x3d1b107c6dbecb1095e2299e527c9d5e4856793c56acfdbcb6b13cfb97998ed9` |
| **Remittance Proof** | `0x928eb7f0c811872346b0ff487c21d6eab96ced6bcd2ad52e9a65f163732e8d9c` |
| **Payroll Proof** | `0x5a270e52246f7b53ef60be90840dbfa6d78fa05ba4596cb7a1fe1534205851ea` |
| **Loan Repaid** | `0xa40862e860f036d49a9515be2f41d8428365bc70a240208a49508198e169e112` |
| **Liquidity Provider** | `0x42fd18814f3fd38dbfb1928729c03639676b369d29ccae2364f790e19b6586b4` |
| **DeFi Score** | `0xcb5e3a505f31b0ce1c7fd4ec250047747ee6a5a8358f83653bf0ab69ff9cf396` |

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- MetaMask or Rainbow Wallet

### 1. Clone the Repository
```bash
git clone https://github.com/Mr-Ben-dev/polyseal.git
cd polyseal
```

### 2. Install Dependencies
```bash
cd web
npm install
```

### 3. Environment Variables (Mainnet)
Create a `.env` file in the `web` directory:
```env
VITE_EAS_CONTRACT_ADDRESS=0xd624943e0dd7fcd204026f5e8e4d29773998c1aa
VITE_SCHEMA_REGISTRY_ADDRESS=0x7876EEF51A891E737AF8ba5A5E0f0Fd29073D5a7
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_EAS_GRAPHQL_URL=https://polygon.easscan.org/graphql
VITE_CHAIN_ID=137
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 4. Run Locally
```bash
npm run dev
```

## 🧪 Verification & Testing

### Create a Private Credential
1. Go to **Create Attestation**.
2. Select **Private Credential**.
3. Enter details (Name, ID, etc.).
4. Sign the transaction.
5. Go to **Credentials** tab to view it.
6. Click "Generate Proof" to create a selective disclosure proof.

### Create a Payment Proof
1. Go to **Payments**.
2. Enter Recipient Address and Amount.
3. Select Type: **Payroll** or **Remittance**.
4. Click **Create Payment Proof**.
5. View the attestation on [polygon.easscan.org](https://polygon.easscan.org).

### Check DeFi Score
1. Go to **DeFi Score**.
2. The app calculates your score based on on-chain history.
3. Click **Export Score as Attestation** to verify it on-chain.

### View Analytics
1. Go to **Analytics**.
2. See your attestation metrics and weekly trends.
3. Click **Export CSV** for accounting.

## 🏆 Polygon Buildathon Wave 4
This project was built for the Polygon Buildathon, focusing on **Privacy and Payments**.

**Key Differentiators:**
- ✅ Mainnet Deployed (7 schemas)
- ✅ Analytics Dashboard with CSV Export
- ✅ Merkle-based Selective Disclosure
- ✅ Multi-chain Support (Polygon + Katana)
- ✅ Enterprise-grade Batch Operations

---
*Built with ❤️ by the Polyseal Team*
