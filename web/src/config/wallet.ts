import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { CHAIN_ID } from "../constants/eas";

const polygonMainnet: Chain = {
    id: 137,
    name: "Polygon",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://polygon-rpc.com"] },
        public: { http: ["https://polygon-rpc.com"] },
    },
    blockExplorers: {
        default: { name: "PolygonScan", url: "https://polygonscan.com" },
    },
    testnet: false,
};

const amoyChain: Chain = {
    id: 80002,
    name: "Polygon Amoy",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: {
        default: { http: ["https://rpc-amoy.polygon.technology"] },
        public: { http: ["https://rpc-amoy.polygon.technology"] },
    },
    blockExplorers: {
        default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" },
    },
    testnet: true,
};

// Choose chain based on environment
const activeChains = CHAIN_ID === 137 ? [polygonMainnet, amoyChain] : [amoyChain, polygonMainnet];

export const wagmiConfig = getDefaultConfig({
    appName: "Polyseal",
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: activeChains as [Chain, ...Chain[]],
});

export const chains = activeChains;
export const isMainnet = CHAIN_ID === 137;
