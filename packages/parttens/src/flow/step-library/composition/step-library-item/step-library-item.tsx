'use client'

import { IconFrame } from '@tc96/elements/icon-frame'
import { cn } from '@tc96/utils'
import { BoxIcon, GitBranchIcon, ZapIcon } from 'lucide-react'
import { type ReactElement, useId } from 'react'
import {
  FLOW_STEP_TRANSFER_TYPE,
  serializeStepTransfer,
} from '../../../canvas/core'
import {
  flowStepLibraryItemDescriptionClassName,
  flowStepLibraryItemTextClassName,
  flowStepLibraryItemVariants,
} from '../../lib/variants'
import type { FlowStepLibraryItemProps } from '../../types'

const kindIcons = {
  action: BoxIcon,
  condition: GitBranchIcon,
  trigger: ZapIcon,
} as const

export function FlowStepLibraryItem({
  collapsed = false,
  disabled = false,
  icon,
  onAdd,
  type,
}: Readonly<FlowStepLibraryItemProps>): ReactElement {
  const descriptionId = useId()
  const kind = type.kind ?? 'action'
  const KindIcon = kindIcons[kind]
  const describes = Boolean(type.description) && !collapsed

  return (
    <button
      aria-describedby={describes ? descriptionId : undefined}
      aria-label={type.label}
      className={cn(flowStepLibraryItemVariants({ collapsed }))}
      data-kind={kind}
      disabled={disabled}
      data-slot="flow-step-library-item"
      draggable={!disabled}
      onClick={() => onAdd(type)}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          FLOW_STEP_TRANSFER_TYPE,
          serializeStepTransfer(type),
        )
        event.dataTransfer.setData('text/plain', type.label)
        event.dataTransfer.effectAllowed = 'copy'
      }}
      type="button"
    >
      <IconFrame>{icon ?? <KindIcon />}</IconFrame>
      {collapsed ? null : (
        <span className={flowStepLibraryItemTextClassName}>
          <span className="truncate font-medium">{type.label}</span>
          {type.description ? (
            <span
              className={flowStepLibraryItemDescriptionClassName}
              id={descriptionId}
            >
              {type.description}
            </span>
          ) : null}
        </span>
      )}
    </button>
  )
}
