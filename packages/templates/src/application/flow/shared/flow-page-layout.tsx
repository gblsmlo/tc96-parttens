'use client'

import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { cn } from '@tc96/utils'
import type { ReactElement, ReactNode } from 'react'

export interface FlowPageLayoutProps {
  canvas: ReactNode
  className?: string
  framed?: boolean
  header: ReactNode
  inspector: ReactNode
  overlay?: ReactNode
  renderLibrary: (collapsed: boolean) => ReactNode
}

export function FlowPageLayout({
  canvas,
  className,
  framed = true,
  header,
  inspector,
  overlay,
  renderLibrary,
}: Readonly<FlowPageLayoutProps>): ReactElement {
  const wide = useMediaQuery('md')

  return (
    <div
      className={cn(
        'flex min-h-160 min-w-0 flex-1 flex-col overflow-hidden bg-background',
        framed && 'rounded-xl border',
        className,
      )}
      data-slot="flow-page"
    >
      {header}
      <div className="flex min-h-0 min-w-0 flex-1">
        {renderLibrary(!wide)}
        <div
          className={cn('relative min-w-0 flex-1', !framed && 'p-4')}
          data-slot="flow-page-canvas"
        >
          {canvas}
          {overlay}
        </div>
        {inspector}
      </div>
    </div>
  )
}
