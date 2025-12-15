export const EAS_CONTRACT_ADDRESS = import.meta.env.VITE_EAS_CONTRACT_ADDRESS;
export const SCHEMA_REGISTRY_ADDRESS = import.meta.env.VITE_SCHEMA_REGISTRY_ADDRESS;
export const POLYGON_RPC_URL = import.meta.env.VITE_POLYGON_RPC_URL || "https://polygon-rpc.com";
export const EAS_GRAPHQL_URL = import.meta.env.VITE_EAS_GRAPHQL_URL;
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 137;

// Dynamic explorer URLs based on network
export const EXPLORER_BASE_URL = CHAIN_ID === 137
    ? "https://polygon.easscan.org"
    : "https://polygon-amoy.easscan.org";
export const ATTESTATION_EXPLORER_URL = `${EXPLORER_BASE_URL}/attestation/view`;
export const POLYGONSCAN_URL = CHAIN_ID === 137
    ? "https://polygonscan.com"
    : "https://amoy.polygonscan.com";
