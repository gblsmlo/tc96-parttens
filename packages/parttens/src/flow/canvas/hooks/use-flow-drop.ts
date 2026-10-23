import { useReactFlow } from '@xyflow/react'
import { type DragEvent, useCallback } from 'react'
import {
  FLOW_STEP_TRANSFER_TYPE,
  type FlowStepType,
  parseStepTransfer,
} from '../core'
import type { FlowPosition } from '../types'

export interface UseFlowDropOptions {
  disabled?: boolean
  onStepDrop?: (type: FlowStepType, position: FlowPosition) => void
  snapToGrid?: boolean
}

export function useFlowDrop({
  disabled,
  onStepDrop,
  snapToGrid,
}: UseFlowDropOptions) {
  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback(
    (event: DragEvent) => {
      if (disabled) return
      if (!event.dataTransfer.types.includes(FLOW_STEP_TRANSFER_TYPE)) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    [disabled],
  )

  const onDrop = useCallback(
    (event: DragEvent) => {
      if (disabled) return
      const type = parseStepTransfer(
        event.dataTransfer.getData(FLOW_STEP_TRANSFER_TYPE),
      )
      if (!type) return
      event.preventDefault()
      const position = screenToFlowPosition(
        { x: event.clientX, y: event.clientY },
        { snapToGrid },
      )
      onStepDrop?.(type, position)
    },
    [disabled, onStepDrop, screenToFlowPosition, snapToGrid],
  )

  return { onDragOver, onDrop }
}
