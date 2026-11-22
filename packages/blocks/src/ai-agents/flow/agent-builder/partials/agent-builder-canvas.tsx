'use client'

import { FlowCanvas } from '@tc96/parttens/flow/canvas/composition/flow-canvas/flow-canvas'
import { FlowCanvasControls } from '@tc96/parttens/flow/canvas/composition/flow-canvas-controls/flow-canvas-controls'
import { NetworkIcon } from 'lucide-react'
import type { ComponentProps, ReactElement } from 'react'
import { FlowToolButton } from '../../shared/flow-tool-button'
import type { FlowPageLabels } from '../../shared/types'
import { agentBuilderLabels } from './agent-builder-labels'

export interface AgentBuilderCanvasProps
  extends Omit<
    ComponentProps<typeof FlowCanvas>,
    'children' | 'direction' | 'labels'
  > {
  labels?: FlowPageLabels
  locked?: boolean
  onTidy: () => void
}

export function AgentBuilderCanvas({
  labels = agentBuilderLabels,
  locked = false,
  onTidy,
  ...canvas
}: Readonly<AgentBuilderCanvasProps>): ReactElement {
  return (
    <FlowCanvas {...canvas} direction="vertical" labels={labels.canvas}>
      <FlowCanvasControls>
        <FlowToolButton
          disabled={locked}
          label={labels.organizeTree}
          onClick={onTidy}
          size="sm"
        >
          <NetworkIcon aria-hidden="true" />
          {labels.organizeTree}
        </FlowToolButton>
      </FlowCanvasControls>
    </FlowCanvas>
  )
}
