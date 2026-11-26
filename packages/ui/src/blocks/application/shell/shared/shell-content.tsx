import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'

export interface ShellContentProps {
  children?: ReactNode
  padded: boolean
  scrollArea: boolean
}

export function ShellContent({
  children,
  padded,
  scrollArea,
}: Readonly<ShellContentProps>): ReactElement {
  const page = cn('flex flex-col', padded && 'gap-4 p-4')

  if (!scrollArea)
    return (
      <div
        className={cn(page, 'min-h-0 min-w-0 flex-1')}
        data-slot="shell-content"
      >
        {children}
      </div>
    )

  return (
    <ScrollArea className="min-h-0 flex-1" data-slot="shell-content">
      <div className={page}>{children}</div>
    </ScrollArea>
  )
}
