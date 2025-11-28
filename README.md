# 🌟 POLYSEAL — Self-Sovereign Identity and Payment Trust Layer

Polyseal transforms how Web3 handles trust, identity, and payments. We built the infrastructure that makes private credentials, verifiable payments, and DeFi reputation portable across the entire Polygon ecosystem.

![Polyseal Dashboard](./web/public/favicon.svg)

## 🚀 Live Demo
**Production App**: [polyseal-jade.vercel.app](https://polyseal-jade.vercel.app)  
**Network**: Polygon Amoy Testnet (Chain ID: 80002)

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
- **Token Support**: USDC, USDT, DAI, POL.

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
- **Blockchain**: Polygon Amoy Testnet
- **Attestation**: Ethereum Attestation Service (EAS)
- **Cryptography**: Merkle Tree (merkletreejs) for privacy
- **Wallet**: RainbowKit, Wagmi, Viem

## 🔗 Deployed Contracts & Schemas

| Name | Address / UID |
|------|---------------|
| **EAS Contract** | `0xC2679fBD37d54388Ce493F1DB75320D236e1815e` |
| **Schema Registry** | `0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0` |
| **Private Credential** | `0x95f3bb51240d66ae81e278ef7bb850cf1f1c2691ba49d87be9b32311208172e2` |
| **Payment Receipt** | `0x3d1b107c6dbecb1095e2299e527c9d5e4856793c56acfdbcb6b13cfb97998ed9` |
| **Remittance Proof** | `0x928eb7f0c811872346b0ff487c21d6eab96ced6bcd2ad52e9a65f163732e8d9c` |
| **Payroll Proof** | `0x5a270e52246f7b53ef60be90840dbfa6d78fa05ba4596cb7a1fe1534205851ea` |
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

### 3. Environment Variables
Create a `.env` file in the `web` directory:
```env
VITE_EAS_CONTRACT_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e
VITE_SCHEMA_REGISTRY_ADDRESS=0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0
VITE_POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
VITE_EAS_GRAPHQL_URL=https://polygon-amoy.easscan.org/graphql
VITE_CHAIN_ID=80002
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
5. View the attestation on the explorer.

### Check DeFi Score
1. Go to **DeFi Score**.
2. The app calculates your score based on on-chain history.
3. Click **Export Score as Attestation** to verify it on-chain.

## 🏆 Polygon Buildathon Wave 3
This project was built for the Polygon Buildathon Wave 3, focusing on **Privacy and Payments**.

---
*Built with ❤️ by the Polyseal Team*
