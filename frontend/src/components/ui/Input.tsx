import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helperText?: string
  error?: string
}

export default function Input({ label, helperText, error, className = '', id, ...props }: Props) {
  const inputId = id || props.name
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        helperText && <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
