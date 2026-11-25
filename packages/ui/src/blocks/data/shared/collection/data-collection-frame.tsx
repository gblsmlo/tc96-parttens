import { cn } from '@tc96/utils'
import type { ComponentProps, ReactNode } from 'react'

export interface DataCollectionFrameProps
  extends Omit<ComponentProps<'section'>, 'title'> {
  notice?: ReactNode
  title: string
  toolbar: ReactNode
}

export function DataCollectionFrame({
  children,
  className,
  notice,
  title,
  toolbar,
  ...props
}: Readonly<DataCollectionFrameProps>) {
  return (
    <section
      aria-label={title}
      className={cn('grid min-w-0 gap-4', className)}
      {...props}
    >
      {notice}
      {toolbar}
      {children}
    </section>
  )
}
