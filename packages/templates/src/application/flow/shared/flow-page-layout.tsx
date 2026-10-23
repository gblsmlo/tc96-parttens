'use client'

import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'

export interface FlowPageLayoutProps {
  canvas: ReactNode
  className?: string
  header: ReactNode
  inspector: ReactNode
  overlay?: ReactNode
  renderLibrary: (collapsed: boolean) => ReactNode
}

export function FlowPageLayout({
  canvas,
  className,
  header,
  inspector,
  overlay,
  renderLibrary,
}: Readonly<FlowPageLayoutProps>): ReactElement {
  const wide = useMediaQuery('md')

  return (
    <div
      className={cn(
        'flex min-h-160 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background',
        className,
      )}
      data-slot="flow-page"
    >
      {header}
      <div className="flex min-h-0 min-w-0 flex-1">
        {renderLibrary(!wide)}
        <div className="relative min-w-0 flex-1" data-slot="flow-page-canvas">
          {canvas}
          {overlay}
        </div>
        {inspector}
      </div>
    </div>
  )
}
