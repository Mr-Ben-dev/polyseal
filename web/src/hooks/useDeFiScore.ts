import { useState, useCallback, useEffect } from "react";
import { scoreService } from "../services/score.service";
import { useWalletContext } from "../context/WalletContext";

export function useDeFiScore() {
    const { address } = useWalletContext();
    const [score, setScore] = useState(0);
    const [breakdown, setBreakdown] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const refreshScore = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            const result = await scoreService.calculateScore(address);
            setScore(result.total);
            setBreakdown(result.breakdown);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    const attestScore = useCallback(async () => {
        if (!address || !breakdown) return;
        return scoreService.createScoreAttestation(address, { total: score, ...breakdown });
    }, [address, score, breakdown]);

    useEffect(() => {
        refreshScore();
    }, [refreshScore]);

    return { score, breakdown, isLoading, refreshScore, attestScore };
}
