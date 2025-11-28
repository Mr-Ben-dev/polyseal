import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { POLYGON_AMOY_RPC_URL } from "../constants/eas";

const amoyChain: Chain = {
    id: 80002,
    name: "Polygon Amoy",
    nativeCurrency: { name: "Polygon", symbol: "POL", decimals: 18 },
    rpcUrls: {
        default: { http: [POLYGON_AMOY_RPC_URL] },
        public: { http: [POLYGON_AMOY_RPC_URL] },
    },
    blockExplorers: {
        default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" },
    },
    testnet: true,
};

export const wagmiConfig = getDefaultConfig({
    appName: "Polyseal",
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    chains: [amoyChain],
});

export const chains = [amoyChain];
