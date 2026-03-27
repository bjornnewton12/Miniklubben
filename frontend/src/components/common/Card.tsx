import React from 'react'

  interface CardProps {
    children: React.ReactNode
    className?: string
  }

  function Card({ children, className = '' }: CardProps) {
    return (
      <div className={`w-full max-w-sm bg-gray-100 rounded-2xl p-6 ${className}`}>
        {children}
      </div>
    )
  }

  export default Card