'use client'

import { TreeStructureIcon } from '@phosphor-icons/react'
import { FlowCanvas } from '@tc96/ui/patterns/flow/canvas/composition/flow-canvas/flow-canvas'
import { FlowCanvasControls } from '@tc96/ui/patterns/flow/canvas/composition/flow-canvas-controls/flow-canvas-controls'
import type { ComponentProps, ReactElement } from 'react'
import { FlowToolButton } from '../../shared/flow-tool-button'
import type { FlowPageLabels } from '../../shared/types'
import { flow2Labels } from './flow-2-labels'

export interface Flow2CanvasProps
  extends Omit<
    ComponentProps<typeof FlowCanvas>,
    'children' | 'direction' | 'labels'
  > {
  labels?: FlowPageLabels
  locked?: boolean
  onTidy: () => void
}

export function Flow2Canvas({
  labels = flow2Labels,
  locked = false,
  onTidy,
  ...canvas
}: Readonly<Flow2CanvasProps>): ReactElement {
  return (
    <FlowCanvas {...canvas} direction="vertical" labels={labels.canvas}>
      <FlowCanvasControls>
        <FlowToolButton
          disabled={locked}
          label={labels.organizeTree}
          onClick={onTidy}
          size="sm"
        >
          <TreeStructureIcon aria-hidden="true" />
          {labels.organizeTree}
        </FlowToolButton>
      </FlowCanvasControls>
    </FlowCanvas>
  )
}
