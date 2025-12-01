import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 bg-brand-600 text-white hover:bg-brand-700 shadow-soft',
  ghost: 'bg-transparent text-gray-700 text-ink-700 hover:bg-gray-100',
  outline: 'border border-gray-300 border-border text-gray-700 text-ink-700 hover:bg-gray-50',
  danger: 'bg-red-600 bg-danger text-white hover:bg-red-700',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export default function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: Props) {
  const isDisabled = disabled || isLoading
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]'} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
          aria-hidden="true"
        />
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
}
