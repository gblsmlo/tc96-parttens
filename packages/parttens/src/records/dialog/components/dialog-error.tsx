import type { ReactNode } from 'react'

export function DialogError({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p
      className="px-6 pb-4 text-destructive-foreground text-sm"
      data-slot="dialog-error"
      role="alert"
    >
      {children}
    </p>
  )
}
