// src/components/ui/FormField.tsx
import React from 'react'
import { Input } from './Input'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block font-bold text-[var(--palette-text)]">
          {label}
        </label>
        <Input ref={ref} id={inputId} error={error} {...props} />
        {error && (
          <p className="text-sm text-[var(--danger)]">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
