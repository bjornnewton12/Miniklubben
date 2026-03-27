import React from 'react'

  interface TextProps {
    children: React.ReactNode
    className?: string
  }

  export function H1({ children, className = '' }: TextProps) {
    return (
      <h1 className={`font-black text-3xl font-[Arial] ${className}`}>
        {children}
      </h1>
    )
  }

  export function H2({ children, className = '' }: TextProps) {
    return (
      <h2 className={`font-black text-2xl font-[Arial] ${className}`}>
        {children}
      </h2>
    )
  }

  export function H3({ children, className = '' }: TextProps) {
    return (
      <h3 className={`font-normal text-base font-[Arial] ${className}`}>
        {children}
      </h3>
    )
  }

  export function Label({ children, className = '' }: TextProps) {
    return (
      <p className={`font-normal text-sm font-[Arial] ${className}`}>
        {children}
      </p>
    )
  }