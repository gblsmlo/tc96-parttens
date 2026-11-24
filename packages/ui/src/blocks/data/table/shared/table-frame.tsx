import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'

export interface TableFrameProps
  extends Omit<ComponentProps<'section'>, 'title'> {
  title: string
  toolbar: ReactNode
}

export function TableFrame({
  children,
  className,
  title,
  toolbar,
  ...props
}: Readonly<TableFrameProps>) {
  return (
    <section
      aria-label={title}
      className={cn('grid gap-4', className)}
      {...props}
    >
      {toolbar}
      {children}
    </section>
  )
}
