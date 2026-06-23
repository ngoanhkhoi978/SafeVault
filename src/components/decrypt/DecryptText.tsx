import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Clock, Unlock } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { decryptText } from '@/lib/crypto';
import { copyToClipboard, formatDuration } from '@/lib/utils';

export function DecryptText() {
  const [ciphertext, setCiphertext] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const canDecrypt = ciphertext.trim() && password;

  const handleDecrypt = async () => {
    if (!canDecrypt) return;
    setError(null);
    setLoading(true);
    try {
      const res = await decryptText(ciphertext.trim(), password);
      setResult(res.plaintext);
      setDuration(res.duration);
      toast('Text decrypted successfully', 'success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Decryption failed';
      setError(msg);
      setResult(null);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="sv-workspace"
    >
      <Textarea
        label="Ciphertext"
        placeholder="Paste encrypted text here..."
        value={ciphertext}
        onChange={(e) => setCiphertext(e.target.value)}
        rows={5}
        id="decrypt-ciphertext"
      />

      <PasswordInput
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id="decrypt-password"
      />

      {error && <p className="sv-error">{error}</p>}

      <Button
        onClick={handleDecrypt}
        disabled={!canDecrypt}
        loading={loading}
        icon={<Unlock size={15} />}
      >
        Decrypt
      </Button>

      <AnimatePresence>
        {result !== null && (
          <motion.div
            className="sv-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="sv-result-header">
              <span className="sv-result-label">Decrypted Text</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
