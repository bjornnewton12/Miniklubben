import React from 'react'

  interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: 'button' | 'submit'
    variant?: 'primary' | 'ghost'
    disabled?: boolean
  }

  function Button({ children, onClick, type = 'button', variant = 'primary', disabled }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={variant === 'ghost' ? 'ghost' : ''}
      >
        {children}
      </button>
    )
  }

  export default Button