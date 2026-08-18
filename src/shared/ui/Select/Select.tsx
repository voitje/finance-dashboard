import type { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}

export const Select = ({ children, ...props }: SelectProps) => {
  return <select {...props}>{children}</select>
}
