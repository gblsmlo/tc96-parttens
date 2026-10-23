import { Group } from '@tc96/ui/group'
import { NodeToolbar, Position } from '@xyflow/react'
import type { ReactElement } from 'react'
import type { FlowStep } from '../core'
import { flowActionIcons, resolveStepKind, stepActionsFor } from '../lib/steps'
import { useFlowCanvasContext } from '../store/flow-canvas-context'
import { FlowControlButton } from './flow-control-button'

export function FlowStepToolbar({
  step,
  visible,
}: Readonly<{ step: FlowStep; visible: boolean }>): ReactElement {
  const { labels, onStepAction, stepTypes } =
    useFlowCanvasContext('FlowStepToolbar')
  const kind = resolveStepKind(step, stepTypes)
  return (
    <NodeToolbar isVisible={visible} offset={12} position={Position.Top}>
      <Group
        aria-label={labels.stepToolbar(step.name)}
        className="nodrag nopan"
        data-slot="flow-step-toolbar"
      >
        {stepActionsFor(kind, 'toolbar').map((action) => {
          const Icon = flowActionIcons[action]
          return (
            <FlowControlButton
              key={action}
              label={labels.actions[action](step.name)}
              onClick={() => onStepAction?.(action, step.id)}
              size="icon-sm"
              tooltip={labels.menuActions[action]}
              variant={action === 'delete' ? 'destructive-outline' : 'outline'}
            >
              <Icon aria-hidden="true" />
            </FlowControlButton>
          )
        })}
      </Group>
    </NodeToolbar>
  )
}
