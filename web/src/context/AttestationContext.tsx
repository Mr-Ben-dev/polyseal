import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useWalletContext } from "./WalletContext";
import { EAS_GRAPHQL_URL } from "../constants/eas";

interface AttestationContextType {
    myAttestations: any[];
    isLoading: boolean;
    refreshAttestations: () => void;
}

const AttestationContext = createContext<AttestationContextType | null>(null);

export function AttestationProvider({ children }: { children: ReactNode }) {
    const { address } = useWalletContext();
    const [myAttestations, setMyAttestations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshAttestations = async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            // Query GraphQL
            const response = await fetch(EAS_GRAPHQL_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            query Attestations($where: AttestationWhereInput) {
              attestations(where: $where, orderBy: { time: desc }) {
                id
                attester
                recipient
                schemaId
                time
                expirationTime
                revocationTime
                refUID
                revocable
                data
              }
            }
          `,
                    variables: {
                        where: {
                            OR: [
                                { attester: { equals: address } },
                                { recipient: { equals: address } }
                            ]
                        }
                    }
                })
            });
            const json = await response.json();
            if (json.data && json.data.attestations) {
                setMyAttestations(json.data.attestations);
            }
        } catch (error) {
            console.error("Failed to fetch attestations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAttestations();
    }, [address]);

    return (
        <AttestationContext.Provider value={{ myAttestations, isLoading, refreshAttestations }}>
            {children}
        </AttestationContext.Provider>
    );
}

export function useAttestationContext() {
    const context = useContext(AttestationContext);
    if (!context) throw new Error("useAttestationContext must be used within AttestationProvider");
    return context;
}
