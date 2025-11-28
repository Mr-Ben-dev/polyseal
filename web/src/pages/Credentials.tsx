import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Calendar,
  CheckCircle,
  QrCode,
  Download,
  Share2,
  Copy
} from "lucide-react";
import { useAttestationContext } from "../context/AttestationContext";
import { SCHEMAS } from "../constants/schemas";
import { MerkleService } from "../services/merkle.service";
import { toast } from "react-hot-toast";

export default function Credentials() {
  const [activeTab, setActiveTab] = useState<"my" | "shared">("my");
  const [selectedCredential, setSelectedCredential] = useState<any | null>(null);
  const { myAttestations } = useAttestationContext();

  const credentials = myAttestations.filter(a => a.schemaId === SCHEMAS.PRIVATE_CREDENTIAL);

  const [metadata, setMetadata] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({});
  const [generatedProof, setGeneratedProof] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCredential) {
      const stored = localStorage.getItem(`credential_${selectedCredential.id}`);
      if (stored) {
        const meta = JSON.parse(stored);
        setMetadata(meta);
        const initial: Record<string, boolean> = {};
        if (meta.fields) {
          Object.keys(meta.fields).forEach(k => initial[k] = false);
        }
        setSelectedFields(initial);
      } else {
        setMetadata(null);
      }
      setGeneratedProof(null);
    }
  }, [selectedCredential]);

  const handleGenerateProof = () => {
    if (!metadata) return;

    try {
      const { tree, root } = MerkleService.buildTree(metadata.fields);
      const keysToShare = Object.keys(selectedFields).filter(k => selectedFields[k]);

      if (keysToShare.length === 0) {
        toast.error("Select at least one field to share");
        return;
      }

      const { disclosed, proofs } = MerkleService.selectiveDisclosure(metadata.fields, keysToShare, tree);

      const proofObject = {
        uid: selectedCredential.id,
        root,
        disclosed,
        proofs
      };

      setGeneratedProof(JSON.stringify(proofObject, null, 2));
      toast.success("Proof generated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate proof");
    }
  };

  const copyProof = () => {
    if (generatedProof) {
      navigator.clipboard.writeText(generatedProof);
      toast.success("Proof copied to clipboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Credentials</h1>
        <p className="text-muted-foreground text-lg">
          Manage your verifiable credentials and control what you share
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-8"
      >
        <button
          onClick={() => setActiveTab("my")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "my"
            ? "bg-primary text-background"
            : "glass-card hover:border-primary/50"
            }`}
        >
          My Credentials
        </button>
        <button
          onClick={() => setActiveTab("shared")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === "shared"
            ? "bg-primary text-background"
            : "glass-card hover:border-primary/50"
            }`}
        >
          Shared With Me
        </button>
      </motion.div>

      {/* Credentials Grid */}
      {activeTab === "my" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {credentials.length === 0 ? <p>No credentials found.</p> : credentials.map((credential, index) => (
            <motion.div
              key={credential.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedCredential(credential)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-semibold flex items-center gap-1">
                  <CheckCircle size={14} />
                  Valid
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">Private Credential</h3>
              <p className="text-sm text-muted-foreground mb-4">
                UID: {credential.id.slice(0, 8)}...
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  <span>Issued: {new Date(Number(credential.time) * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === "shared" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground mx-auto mb-6">
            <Share2 size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            No credentials shared with you yet
          </h3>
          <p className="text-muted-foreground">
            Credentials that others share with you will appear here
          </p>
        </motion.div>
      )}

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCredential(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Private Credential</h2>
                <p className="text-muted-foreground">
                  UID: {selectedCredential.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedCredential(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {metadata ? (
                <>
                  <div className="glass-card p-6 bg-primary/10">
                    <h3 className="font-semibold mb-4">Credential Fields (Stored Locally)</h3>
                    <div className="space-y-3">
                      {Object.entries(metadata.fields || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Selective Disclosure</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose which fields to share when presenting this credential
                    </p>
                    <div className="space-y-3">
                      {Object.keys(metadata.fields || {}).map((key) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFields[key] || false}
                            onChange={(e) => setSelectedFields({ ...selectedFields, [key]: e.target.checked })}
                            className="w-4 h-4 rounded border-border text-primary"
                          />
                          <span className="text-sm">{key}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {generatedProof && (
                    <div className="glass-card p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Generated Proof</h3>
                        <button onClick={copyProof} className="text-primary hover:text-primary/80">
                          <Copy size={16} />
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={generatedProof}
                        className="w-full h-32 bg-input p-2 rounded text-xs font-mono"
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <a
                      href={`https://polygon-amoy.easscan.org/attestation/view/${selectedCredential.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 glass-card hover:border-primary/50 rounded-lg transition-all flex items-center justify-center gap-2 text-foreground"
                    >
                      View on Explorer
                    </a>
                    <button
                      onClick={handleGenerateProof}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg btn-glow hover:scale-105 transition-transform">
                      Generate Proof
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Metadata for this credential not found in local storage.
                    Selective disclosure is only available for credentials you created on this device.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
