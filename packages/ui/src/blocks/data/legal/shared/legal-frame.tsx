import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'

export interface LegalFrameProps
  extends Omit<ComponentProps<'section'>, 'title'> {
  title: string
  toolbar: ReactNode
}

export function LegalFrame({
  children,
  className,
  title,
  toolbar,
  ...props
}: Readonly<LegalFrameProps>) {
  return (
    <section
      aria-label={title}
      className={cn('grid min-w-0 gap-4', className)}
      {...props}
    >
      {toolbar}
      {children}
    </section>
  )
}
