// src/components/ui/Input.tsx
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 border rounded-md bg-white text-[var(--palette-text)] transition-colors duration-200 focus:outline-none focus:border-[var(--palette-gold)] ${
          error ? 'border-[var(--danger)]' : 'border-[var(--palette-border)]'
        } ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
