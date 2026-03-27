import React from 'react'

  interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    variant?: 'primary' | 'ghost'
    disabled?: boolean
  }

  function Button({ children, onClick, type = 'button', variant = 'primary', disabled }: ButtonProps) {
    const styles = {
      primary: disabled ? 'bg-gray-300 text-white' : 'bg-gray-500 text-white',
      ghost: 'text-gray-500',
    }

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full rounded-full py-2 font-medium text-sm ${styles[variant]}`}
      >
        {children}
      </button>
    )
  }

  export default Button