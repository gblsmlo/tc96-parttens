'use client'

import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import {
  flowStepGroupClassName,
  flowStepGroupLabelClassName,
} from '../../lib/variants'
import type { FlowStepLibraryGroupProps } from '../../types'
import { FlowStepLibraryItem } from '../step-library-item/step-library-item'

export function FlowStepLibraryGroup({
  collapsed = false,
  disabled = false,
  group,
  icons,
  onAdd,
}: Readonly<FlowStepLibraryGroupProps>): ReactElement {
  return (
    <fieldset
      className={flowStepGroupClassName}
      data-slot="flow-step-library-group"
    >
      <legend
        className={cn(flowStepGroupLabelClassName, collapsed && 'sr-only')}
      >
        {group.label}
      </legend>
      {group.types.map((type) => (
        <FlowStepLibraryItem
          collapsed={collapsed}
          disabled={disabled}
          icon={icons?.[type.id]}
          key={type.id}
          onAdd={onAdd}
          type={type}
        />
      ))}
    </fieldset>
  )
}
