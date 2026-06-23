import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Clock, Unlock, FileIcon, X } from 'lucide-react';
import { DropZone } from '@/components/ui/DropZone';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { decryptFile } from '@/lib/crypto';
import { formatFileSize, formatDuration, downloadBlob } from '@/lib/utils';
import type { DecryptFileResult } from '@/lib/crypto.types';

export function DecryptFile() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<DecryptFileResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const canDecrypt = file && password;

  const handleDecrypt = async () => {
    if (!file || !canDecrypt) return;
    setError(null);
    setLoading(true);
    try {
      const res = await decryptFile(file, password);
      setResult(res);
      toast('File decrypted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Decryption failed';
      setError(msg);
      setResult(null);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
    toast('Decrypted file downloaded', 'success');
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="sv-workspace"
    >
      {!file ? (
        <DropZone onFile={setFile} accept=".enc" />
      ) : (
        <motion.div
          className="sv-file-info"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="sv-file-icon">
            <FileIcon size={20} />
          </div>
          <div className="sv-file-details">
            <p className="sv-file-name">{file.name}</p>
            <p className="sv-file-meta">{formatFileSize(file.size)}</p>
          </div>
          <button className="sv-file-remove" onClick={removeFile} aria-label="Remove file">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <PasswordInput
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id="decrypt-file-password"
      />

      {error && <p className="sv-error">{error}</p>}

      <Button
        onClick={handleDecrypt}
        disabled={!canDecrypt}
        loading={loading}
        icon={<Unlock size={15} />}
      >
        Decrypt File
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            className="sv-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="sv-result-header">
              <span className="sv-result-label">Decrypted</span>
              <div className="sv-result-meta-group">
                <span className="sv-result-meta">
                  <Clock size={12} />
                  {formatDuration(result.duration)}
                </span>
                <span className="sv-result-meta">
                  {formatFileSize(result.size)}
                </span>
              </div>
            </div>
            <div className="sv-result-actions">
              <Button variant="primary" size="sm" onClick={handleDownload} icon={<Download size={14} />}>
                Download {result.filename}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
