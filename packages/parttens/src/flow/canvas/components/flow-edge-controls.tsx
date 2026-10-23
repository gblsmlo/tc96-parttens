import { PlusIcon, XIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { FlowConnection } from '../core'
import { flowEdgeControlsClassName } from '../lib/variants'
import { useFlowCanvasContext } from '../store/flow-canvas-context'
import { FlowControlButton } from './flow-control-button'

export function FlowEdgeControls({
  connection,
}: Readonly<{ connection: FlowConnection }>): ReactElement {
  const { connections, labels, onConnectionsChange, onStepAction } =
    useFlowCanvasContext('FlowEdgeControls')
  return (
    <div className={flowEdgeControlsClassName} data-slot="flow-edge-controls">
      <FlowControlButton
        label={labels.edgeAdd(connection.label)}
        onClick={() =>
          onStepAction?.('add-after', connection.source, connection)
        }
        size="icon-xs"
        variant="outline"
      >
        <PlusIcon aria-hidden="true" />
      </FlowControlButton>
      <FlowControlButton
        label={labels.edgeRemove(connection.label)}
        onClick={() =>
          onConnectionsChange?.(
            connections.filter((item) => item.id !== connection.id),
          )
        }
        size="icon-xs"
        variant="outline"
      >
        <XIcon aria-hidden="true" />
      </FlowControlButton>
    </div>
  )
}
