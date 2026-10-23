import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { EllipsisIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { FlowStep } from '../core'
import { flowActionIcons, resolveStepKind, stepActionsFor } from '../lib/steps'
import { useFlowCanvasContext } from '../store/flow-canvas-context'

export function FlowStepMenu({
  step,
}: Readonly<{ step: FlowStep }>): ReactElement {
  const { labels, onStepAction, stepTypes } =
    useFlowCanvasContext('FlowStepMenu')
  const kind = resolveStepKind(step, stepTypes)
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            aria-label={labels.stepMenu(step.name)}
            className="nodrag nopan"
            size="icon-xs"
            variant="ghost"
          />
        }
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {stepActionsFor(kind, 'menu').map((action) => {
          const Icon = flowActionIcons[action]
          return (
            <MenuItem
              key={action}
              onClick={() => onStepAction?.(action, step.id)}
              variant={action === 'delete' ? 'destructive' : 'default'}
            >
              <Icon aria-hidden="true" />
              {labels.menuActions[action]}
            </MenuItem>
          )
        })}
      </MenuPopup>
    </Menu>
  )
}
