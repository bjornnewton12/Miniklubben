import React from 'react'

  interface TextProps {
    children: React.ReactNode
    className?: string
  }

  export function H1({ children, className = '' }: TextProps) {
    return (
      <h1 className={`h1 ${className}`}>
        {children}
      </h1>
    )
  }

  export function H2({ children, className = '' }: TextProps) {
    return (
      <h2 className={`h2 ${className}`}>
        {children}
      </h2>
    )
  }

  export function H3({ children, className = '' }: TextProps) {
    return (
      <h3 className={`h3 ${className}`}>
        {children}
      </h3>
    )
  }

  export function Label({ children, className = '' }: TextProps) {
    return (
      <p className={`label ${className}`}>
        {children}
      </p>
    )
  }