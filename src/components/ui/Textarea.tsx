import { cn } from '@/lib/utils';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="sv-input-wrapper">
      {label && (
        <label htmlFor={textareaId} className="sv-input-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn('sv-textarea', className)}
        {...props}
      />
    </div>
  );
}
