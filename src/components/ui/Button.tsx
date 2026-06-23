import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'sv-btn-primary',
  secondary: 'sv-btn-secondary',
  ghost: 'sv-btn-ghost',
  outline: 'sv-btn-outline',
};

const sizeStyles: Record<string, string> = {
  sm: 'sv-btn-sm',
  md: 'sv-btn-md',
  lg: 'sv-btn-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      className={cn('sv-btn', variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} className="sv-btn-spinner" />
      ) : icon ? (
        <span className="sv-btn-icon">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
