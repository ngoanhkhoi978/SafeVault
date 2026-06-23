import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Clock, Lock } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { encryptText } from '@/lib/crypto';
import { copyToClipboard, downloadBlob, formatDuration } from '@/lib/utils';

export function EncryptText() {
  const [plaintext, setPlaintext] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const canEncrypt = plaintext.trim() && password && password === confirmPassword;

  const handleEncrypt = async () => {
    if (!canEncrypt) return;
    setError(null);
    setLoading(true);
    try {
      const res = await encryptText(plaintext, password);
      setResult(res.ciphertext);
      setDuration(res.duration);
      toast('Text encrypted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Encryption failed';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copyToClipboard(result);
    toast(ok ? 'Copied to clipboard' : 'Failed to copy', ok ? 'success' : 'error');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    downloadBlob(blob, 'encrypted.txt');
    toast('File downloaded', 'success');
  };

  const passwordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="sv-workspace"
    >
      <Textarea
        label="Plaintext"
        placeholder="Enter text to encrypt..."
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value)}
        rows={5}
        id="encrypt-plaintext"
      />

      <div className="sv-password-row">
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="encrypt-password"
        />
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordMismatch ? 'Passwords do not match' : undefined}
          id="encrypt-confirm-password"
        />
      </div>

      {error && <p className="sv-error">{error}</p>}

      <Button
        onClick={handleEncrypt}
        disabled={!canEncrypt}
        loading={loading}
        icon={<Lock size={15} />}
      >
        Encrypt
      </Button>

      <AnimatePresence>
        {result && (
          <motion.div
            className="sv-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="sv-result-header">
              <span className="sv-result-label">Ciphertext</span>
              {duration !== null && (
                <span className="sv-result-meta">
                  <Clock size={12} />
                  {formatDuration(duration)}
                </span>
              )}
            </div>
            <div className="sv-result-content">
              <pre className="sv-result-text">{result}</pre>
            </div>
            <div className="sv-result-actions">
              <Button variant="outline" size="sm" onClick={handleCopy} icon={<Copy size={14} />}>
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} icon={<Download size={14} />}>
                Download
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
