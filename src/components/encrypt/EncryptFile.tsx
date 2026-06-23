import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Clock, Lock, FileIcon, X } from 'lucide-react';
import { DropZone } from '@/components/ui/DropZone';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { encryptFile } from '@/lib/crypto';
import { formatFileSize, formatDuration, downloadBlob } from '@/lib/utils';
import type { EncryptFileResult } from '@/lib/crypto.types';

export function EncryptFile() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState<EncryptFileResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const canEncrypt = file && password && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const handleEncrypt = async () => {
    if (!file || !canEncrypt) return;
    setLoading(true);
    try {
      const res = await encryptFile(file, password);
      setResult(res);
      toast('File encrypted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Encryption failed';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
    toast('Encrypted file downloaded', 'success');
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
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
        <DropZone onFile={setFile} />
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
            <p className="sv-file-meta">
              {formatFileSize(file.size)} · {file.type || 'Unknown type'}
            </p>
          </div>
          <button className="sv-file-remove" onClick={removeFile} aria-label="Remove file">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="sv-password-row">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="encrypt-file-password"
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordMismatch ? 'Passwords do not match' : undefined}
          id="encrypt-file-confirm-password"
        />
      </div>

      <Button
        onClick={handleEncrypt}
        disabled={!canEncrypt}
        loading={loading}
        icon={<Lock size={15} />}
      >
        Encrypt File
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
              <span className="sv-result-label">Encrypted</span>
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
