import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, className, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="sv-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="sv-input-label">
          {label}
        </label>
      )}
      <div className="sv-password-container">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={cn('sv-input sv-input-password', error && 'sv-input-error', className)}
          {...props}
        />
        <button
          type="button"
          className="sv-password-toggle"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="sv-input-error-text">{error}</p>}
    </div>
  );
}
