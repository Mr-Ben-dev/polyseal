import React from "react";
import { Web3Provider } from "./Web3Provider";
import { WalletProvider } from "../context/WalletContext";
import { AttestationProvider } from "../context/AttestationContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <Web3Provider>
            <WalletProvider>
                <AttestationProvider>
                    {children}
                </AttestationProvider>
            </WalletProvider>
        </Web3Provider>
    );
}
