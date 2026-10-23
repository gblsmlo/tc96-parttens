'use client'

import { Button } from '@tc96/ui/button'
import { Group } from '@tc96/ui/group'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { cn } from '@tc96/utils'
import { Panel, useReactFlow, useStore } from '@xyflow/react'
import { HandIcon, MinusIcon, MousePointer2Icon, PlusIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { FlowControlButton } from '../../components/flow-control-button'
import { flowControlsPanelClassName } from '../../lib/variants'
import { useFlowCanvasContext } from '../../store/flow-canvas-context'

export interface FlowCanvasControlsProps {
  children?: ReactNode
  className?: string
}

export function FlowCanvasControls({
  children,
  className,
}: Readonly<FlowCanvasControlsProps>): ReactElement {
  const { labels, mode, setMode } = useFlowCanvasContext('FlowCanvasControls')
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const zoom = useStore((state) => state.transform[2])
  const percent = Math.round(zoom * 100)

  return (
    <Panel
      aria-label={labels.controls}
      className={cn(flowControlsPanelClassName, className)}
      data-slot="flow-canvas-controls"
      position="bottom-left"
      role="group"
    >
      <ToggleGroup
        aria-label={labels.mode}
        onValueChange={(value) => {
          const next = value[0]
          if (next === 'select' || next === 'pan') setMode(next)
        }}
        size="sm"
        value={[mode]}
        variant="outline"
      >
        <ToggleGroupItem aria-label={labels.select} value="select">
          <MousePointer2Icon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label={labels.pan} value="pan">
          <HandIcon aria-hidden="true" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Group>
        <FlowControlButton
          label={labels.zoomOut}
          onClick={() => void zoomOut({ duration: 200 })}
          size="icon-sm"
          variant="outline"
        >
          <MinusIcon aria-hidden="true" />
        </FlowControlButton>
        <Button
          aria-label={labels.zoomLevel(percent)}
          className="tabular-nums"
          onClick={() => void fitView({ duration: 200 })}
          size="sm"
          variant="outline"
        >
          {percent}%
        </Button>
        <FlowControlButton
          label={labels.zoomIn}
          onClick={() => void zoomIn({ duration: 200 })}
          size="icon-sm"
          variant="outline"
        >
          <PlusIcon aria-hidden="true" />
        </FlowControlButton>
      </Group>
      {children}
    </Panel>
  )
}
