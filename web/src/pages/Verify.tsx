import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, Shield, User, Calendar, XCircle } from "lucide-react";
import { useAttestation } from "../hooks/useAttestation";
import { toast } from "react-hot-toast";
import { SCHEMAS } from "../constants/schemas";

export default function Verify() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [attestation, setAttestation] = useState<any>(null);
  const { verifyAttestation, verifyCredentialField, isLoading } = useAttestation();

  const [proofJson, setProofJson] = useState("");
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});

  const handleVerify = async () => {
    if (!searchQuery) return;
    setHasSearched(true);
    setAttestation(null);
    setVerificationResults({});

    try {
      const result = await verifyAttestation(searchQuery);
      setAttestation(result);
    } catch (error) {
      console.error(error);
      toast.error("Attestation not found or invalid");
    }
  };

  const handleVerifyProof = () => {
    try {
      const proofData = JSON.parse(proofJson);
      if (attestation && proofData.uid !== attestation.id) {
        toast.error("Proof UID does not match attestation UID");
        return;
      }

      const results: Record<string, boolean> = {};
      if (proofData.disclosed && proofData.proofs) {
        Object.keys(proofData.disclosed).forEach(key => {
          const value = proofData.disclosed[key];
          const proof = proofData.proofs[key];
          const isValid = verifyCredentialField(proofData.root, key, value, proof);
          results[key] = isValid;
        });
        setVerificationResults(results);
        toast.success("Verification complete");
      } else {
        toast.error("Invalid proof format");
      }
    } catch (e) {
      toast.error("Invalid proof JSON");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Verify Attestation
        </h1>
        <p className="text-muted-foreground text-lg">
          Check the validity and details of any attestation
        </p>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="glass-card p-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Attestation UID"
                className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Result Section */}
      {hasSearched && attestation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Attestation Details</h2>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary">
                <CheckCircle size={20} />
                <span className="font-semibold">{attestation.revocable && !attestation.revocationTime ? "Valid" : "Revoked"}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="text-primary" size={20} />
                  <p className="text-sm text-muted-foreground">Schema UID</p>
                </div>
                <p className="font-mono text-xs break-all">{attestation.schemaId}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-primary" size={20} />
                  <p className="text-sm text-muted-foreground">Issuer</p>
                </div>
                <p className="font-mono text-sm">{attestation.attester}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-primary" size={20} />
                  <p className="text-sm text-muted-foreground">Recipient</p>
                </div>
                <p className="font-mono text-sm">{attestation.recipient}</p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-primary" size={20} />
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                </div>
                <p className="font-semibold">{new Date(Number(attestation.time) * 1000).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-4">
                Raw Data
              </p>
              <pre className="bg-input p-4 rounded-lg overflow-x-auto text-sm break-all">
                {attestation.data}
              </pre>
            </div>
          </div>

          {/* Selective Disclosure Verification */}
          {attestation.schemaId === SCHEMAS.PRIVATE_CREDENTIAL && (
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">
                Verify Private Credential Proof
              </h3>
              <p className="text-muted-foreground mb-6">
                Paste the JSON proof shared by the credential holder to verify specific fields.
              </p>

              <textarea
                rows={6}
                value={proofJson}
                onChange={(e) => setProofJson(e.target.value)}
                placeholder='Paste proof JSON here...'
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm mb-4"
              />

              <button
                onClick={handleVerifyProof}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform w-full md:w-auto mb-6">
                Verify Selected Fields
              </button>

              {Object.keys(verificationResults).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Verification Results:</h4>
                  {Object.entries(verificationResults).map(([key, isValid]) => (
                    <div key={key} className="flex items-center gap-2">
                      {isValid ? <CheckCircle className="text-green-500" size={16} /> : <XCircle className="text-red-500" size={16} />}
                      <span className="font-medium">{key}:</span>
                      <span>{isValid ? "Verified" : "Invalid"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-6">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Enter a UID to verify
          </h3>
          <p className="text-muted-foreground">
            Check the validity and view details of any attestation
          </p>
        </motion.div>
      )}
    </div>
  );
}
