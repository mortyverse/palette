// src/components/ui/Button.tsx
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'action'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide'

  const variantStyles = {
    primary: 'bg-[var(--palette-gold)] text-white hover:bg-[var(--palette-gold-dark)]',
    secondary: 'bg-[var(--palette-card)] border border-[var(--palette-gold)] text-[var(--palette-gold)] hover:bg-[var(--palette-gold)] hover:text-white tracking-widest',
    action: 'border border-[var(--palette-border)] text-[var(--palette-muted)] hover:border-[var(--palette-gold)] hover:text-[var(--palette-gold)] bg-transparent flex items-center gap-2'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
