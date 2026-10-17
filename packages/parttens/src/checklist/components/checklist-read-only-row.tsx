'use client'

import { Checkbox } from '@tc96/ui/checkbox'
import type { ReactElement } from 'react'
import type { PersonPropertyOption } from '../../properties/display/person/person-property'
import {
  type ChecklistDensity,
  type ChecklistVariant,
  checklistCheckboxVariants,
  checklistItemVariants,
} from '../lib/variants'
import type { ChecklistItem, ChecklistProps } from '../types/index'
import { ChecklistItemCard, ChecklistTitle } from './checklist-item-card'
import { ChecklistMetadata } from './checklist-metadata'

export function ChecklistReadOnlyRow({
  authorOptions,
  density,
  variant,
  item,
  locale,
  onItemClick,
  timeZone,
}: Readonly<{
  authorOptions: readonly PersonPropertyOption[]
  density: ChecklistDensity
  variant: ChecklistVariant
  item: ChecklistItem
  locale: string
  onItemClick?: ChecklistProps['onItemClick']
  timeZone: string
}>): ReactElement {
  return (
    <li
      className={checklistItemVariants({ variant })}
      data-completed={item.completed || undefined}
      data-slot="checklist-item"
    >
      <ChecklistItemCard
        action={
          <ChecklistMetadata
            authorOptions={authorOptions}
            item={item}
            locale={locale}
            readOnly
            timeZone={timeZone}
          />
        }
        checkbox={
          <Checkbox
            aria-label={item.title}
            checked={item.completed}
            className={checklistCheckboxVariants({ density })}
            disabled
          />
        }
        density={density}
        variant={variant}
        title={
          <ChecklistTitle
            density={density}
            item={item}
            onItemClick={onItemClick}
          />
        }
      />
    </li>
  )
}
