'use client'

import { Text } from '@tc96/elements/text'
import type { ReactElement, ReactNode } from 'react'
import { EditableText } from '../../properties/display/editable-text/editable-text'
import {
  CHECKLIST_TITLE_BUTTON_CLASSNAME,
  CHECKLIST_TITLE_CLASSNAME,
  CHECKLIST_TITLE_SIZE,
  CHECKLIST_TITLE_TEXT_CLASSNAME,
  type ChecklistDensity,
  checklistRowVariants,
} from '../lib/variants'
import type { ChecklistItem, ChecklistProps } from '../types/index'

export function ChecklistItemCard({
  action,
  checkbox,
  density,
  title,
}: Readonly<{
  action: ReactNode
  checkbox: ReactNode
  density: ChecklistDensity
  title: ReactNode
}>): ReactElement {
  return (
    <div
      className={checklistRowVariants({ density })}
      data-slot="checklist-row"
    >
      <span className="flex shrink-0 items-center justify-center">
        {checkbox}
      </span>
      {title}
      {action}
    </div>
  )
}

export function ChecklistTitle({
  density,
  item,
  onItemClick,
  onRename,
}: Readonly<{
  density: ChecklistDensity
  item: ChecklistItem
  onItemClick?: ChecklistProps['onItemClick']
  onRename?: (title: string) => void
}>): ReactElement {
  const size = CHECKLIST_TITLE_SIZE[density]

  if (onItemClick) {
    return (
      <Text
        aria-label={`Abrir ${item.title}`}
        className={CHECKLIST_TITLE_BUTTON_CLASSNAME}
        data-slot="checklist-title"
        onClick={() => onItemClick(item)}
        render={<button type="button" />}
        size={size}
      >
        {item.title}
      </Text>
    )
  }

  if (onRename) {
    return (
      <span className="min-w-0 flex-1" data-slot="checklist-title">
        <EditableText
          ariaLabel={`Título: ${item.title}`}
          className={CHECKLIST_TITLE_CLASSNAME}
          onCommit={(next) => next && onRename(next)}
          revertWhenEmpty
          size={size}
          value={item.title}
        />
      </span>
    )
  }

  return (
    <Text
      className={CHECKLIST_TITLE_TEXT_CLASSNAME}
      data-slot="checklist-title"
      size={size}
    >
      {item.title}
    </Text>
  )
}
