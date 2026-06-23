import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="sv-input-wrapper">
      {label && (
        <label htmlFor={inputId} className="sv-input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn('sv-input', error && 'sv-input-error', className)}
        {...props}
      />
      {error && <p className="sv-input-error-text">{error}</p>}
    </div>
  );
}
