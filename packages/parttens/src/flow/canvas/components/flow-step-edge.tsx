import { Badge } from '@tc96/ui/badge'
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from '@xyflow/react'
import type { ReactElement } from 'react'
import { flowEdgeLabelClassName, flowEdgePathVariants } from '../lib/variants'
import { useFlowCanvasContext } from '../store/flow-canvas-context'
import type { FlowEdgeType } from '../types'
import { FlowEdgeControls } from './flow-edge-controls'

export function FlowStepEdge({
  data,
  id,
  markerEnd,
  sourcePosition,
  sourceX,
  sourceY,
  targetPosition,
  targetX,
  targetY,
}: Readonly<EdgeProps<FlowEdgeType>>): ReactElement {
  const { edgeControls } = useFlowCanvasContext('FlowStepEdge')
  const connection = data?.connection
  const [path, labelX, labelY] = getSmoothStepPath({
    borderRadius: 12,
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
  })
  const label = connection?.label
  return (
    <>
      <BaseEdge
        className={flowEdgePathVariants({ taken: connection?.taken === true })}
        id={id}
        interactionWidth={20}
        markerEnd={markerEnd}
        path={path}
      />
      {connection && (label || edgeControls) ? (
        <EdgeLabelRenderer>
          <div
            className={flowEdgeLabelClassName}
            data-slot="flow-step-edge-label"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label ? (
              <Badge className="max-w-32 truncate" variant="outline">
                {label}
              </Badge>
            ) : null}
            {edgeControls ? <FlowEdgeControls connection={connection} /> : null}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}
