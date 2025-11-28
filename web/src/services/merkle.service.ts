import { MerkleTree } from "merkletreejs";
import { keccak256, toUtf8Bytes } from "ethers";

type CredentialFields = Record<string, string | number | boolean>;

export class MerkleService {
    static normalizeValue(value: string | number | boolean): string {
        return String(value);
    }

    static hashLeaf(key: string, value: string | number | boolean): string {
        const normalizedValue = this.normalizeValue(value);
        return keccak256(toUtf8Bytes(key + ":" + normalizedValue));
    }

    static buildTree(fields: CredentialFields) {
        const leaves = Object.entries(fields).map(([key, value]) => {
            const hash = this.hashLeaf(key, value);
            return { key, value, hash };
        });

        // Sort leaves by hash to ensure deterministic tree
        leaves.sort((a, b) => a.hash.localeCompare(b.hash));

        const tree = new MerkleTree(leaves.map(l => l.hash), keccak256, { sortPairs: true });
        const root = tree.getHexRoot();

        return { tree, root, leaves };
    }

    static getProof(tree: MerkleTree, key: string, value: string | number | boolean) {
        const leaf = this.hashLeaf(key, value);
        return tree.getHexProof(leaf);
    }

    static verifyProof(root: string, key: string, value: string | number | boolean, proof: string[]): boolean {
        const leaf = this.hashLeaf(key, value);
        return MerkleTree.verify(proof, leaf, root, keccak256, { sortPairs: true });
    }

    static selectiveDisclosure(fields: CredentialFields, selectedKeys: string[], tree: MerkleTree) {
        const disclosed: Record<string, string | number | boolean> = {};
        const proofs: Record<string, string[]> = {};

        selectedKeys.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(fields, key)) {
                const value = fields[key];
                disclosed[key] = value;
                proofs[key] = this.getProof(tree, key, value);
            }
        });

        return { disclosed, proofs };
    }
}
