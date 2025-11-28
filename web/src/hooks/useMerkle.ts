import { useState, useCallback } from "react";
import { MerkleService } from "../services/merkle.service";
import { MerkleTree } from "merkletreejs";

export function useMerkleTree() {
    const [isBuilding, setIsBuilding] = useState(false);

    const buildCredentialTree = useCallback(async (fields: Record<string, string | number | boolean>) => {
        setIsBuilding(true);
        try {
            const result = MerkleService.buildTree(fields);
            return result;
        } finally {
            setIsBuilding(false);
        }
    }, []);

    return { buildCredentialTree, isBuilding };
}

export function useMerkleProof() {
    const generateProof = useCallback((tree: MerkleTree, key: string, value: string | number | boolean) => {
        return MerkleService.getProof(tree, key, value);
    }, []);

    const verify = useCallback((root: string, key: string, value: string | number | boolean, proof: string[]) => {
        return MerkleService.verifyProof(root, key, value, proof);
    }, []);

    return { generateProof, verify };
}
