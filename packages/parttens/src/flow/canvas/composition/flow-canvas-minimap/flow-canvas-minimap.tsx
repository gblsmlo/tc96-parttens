'use client'

import { cn } from '@tc96/utils'
import { MiniMap } from '@xyflow/react'
import type { ReactElement } from 'react'
import { flowMinimapClassName } from '../../lib/variants'
import { useFlowCanvasContext } from '../../store/flow-canvas-context'

export interface FlowCanvasMinimapProps {
  className?: string
}

export function FlowCanvasMinimap({
  className,
}: Readonly<FlowCanvasMinimapProps>): ReactElement {
  const { labels } = useFlowCanvasContext('FlowCanvasMinimap')
  return (
    <MiniMap
      ariaLabel={labels.minimap}
      className={cn(flowMinimapClassName, className)}
      pannable
      position="bottom-right"
      zoomable
    />
  )
}
