import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";

export function useWallet() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();

    const switchToAmoy = () => {
        switchChain({ chainId: 80002 });
    };

    return {
        address,
        isConnected,
        chainId,
        connect: () => {
            const connector = connectors.find(c => c.id === 'injected') || connectors[0];
            if (connector) connect({ connector });
        },
        disconnect,
        switchToAmoy,
    };
}
