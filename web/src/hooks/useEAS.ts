import { useState, useEffect, useCallback } from "react";
import { easService } from "../services/eas.service";
import { SCHEMAS } from "../constants/schemas";

export function useEAS() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        easService.init().then(setIsReady);
    }, []);

    const createAttestation = useCallback(async (
        schemaKey: keyof typeof SCHEMAS,
        recipient: string,
        encodedData: string,
        options: { refUID?: string; expirationTime?: bigint | number } = {}
    ) => {
        if (!isReady) throw new Error("EAS not ready");

        const schemaUID = SCHEMAS[schemaKey];
        return easService.createAttestation({
            schemaUID,
            recipient,
            data: encodedData,
            ...options
        });
    }, [isReady]);

    const getAttestation = useCallback(async (uid: string) => {
        return easService.getAttestation(uid);
    }, []);

    return { isReady, createAttestation, getAttestation };
}
