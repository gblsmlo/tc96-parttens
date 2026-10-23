import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuPopup,
  ContextMenuTrigger,
} from '@tc96/ui/context-menu'
import type { ComponentProps, ReactElement } from 'react'
import type { FlowStep } from '../core'
import {
  flowActionIcons,
  isMutatingAction,
  resolveStepKind,
  stepActionsFor,
} from '../lib/steps'
import { useFlowCanvasContext } from '../store/flow-canvas-context'

export interface FlowStepContextMenuProps extends ComponentProps<'div'> {
  step: FlowStep
}

export function FlowStepContextMenu({
  children,
  step,
  ...props
}: Readonly<FlowStepContextMenuProps>): ReactElement {
  const { labels, locked, onStepAction, stepTypes } = useFlowCanvasContext(
    'FlowStepContextMenu',
  )
  const kind = resolveStepKind(step, stepTypes)
  return (
    <ContextMenu>
      <ContextMenuTrigger {...props}>{children}</ContextMenuTrigger>
      <ContextMenuPopup>
        {stepActionsFor(kind, 'toolbar').map((action) => {
          const Icon = flowActionIcons[action]
          return (
            <ContextMenuItem
              disabled={locked && isMutatingAction(action)}
              key={action}
              onClick={() => onStepAction?.(action, step.id)}
              variant={action === 'delete' ? 'destructive' : 'default'}
            >
              <Icon aria-hidden="true" />
              {labels.menuActions[action]}
            </ContextMenuItem>
          )
        })}
      </ContextMenuPopup>
    </ContextMenu>
  )
}
