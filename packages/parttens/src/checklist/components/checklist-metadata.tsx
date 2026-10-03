'use client'

import type { ReactElement } from 'react'
import { DateProperty } from '../../properties/display/date/date-property'
import {
  PersonProperty,
  type PersonPropertyOption,
} from '../../properties/display/person/person-property'
import {
  calendarDayOffset,
  dueStatus,
  formatChecklistDueDate,
} from '../lib/due-date'
import { checklistDueDateVariants } from '../lib/variants'
import type { ChecklistItem, ChecklistProps } from '../types/index'

export function ChecklistMetadata({
  authorOptions,
  item,
  locale,
  onItemAuthorChange,
  onItemDueDateChange,
  readOnly = false,
  timeZone,
}: Readonly<{
  authorOptions: readonly PersonPropertyOption[]
  item: ChecklistItem
  locale: string
  onItemAuthorChange?: ChecklistProps['onItemAuthorChange']
  onItemDueDateChange?: ChecklistProps['onItemDueDateChange']
  readOnly?: boolean
  timeZone: string
}>): ReactElement | null {
  if (item.authorId === undefined && item.dueDate === undefined) return null
  const dueDayOffset = calendarDayOffset(item.dueDate, new Date(), timeZone)
  const status = dueStatus(dueDayOffset)

  return (
    <span
      className="flex shrink-0 items-center gap-3 text-muted-foreground"
      data-due={item.dueDate !== undefined ? status : undefined}
      data-slot="checklist-actions"
    >
      {item.authorId !== undefined ? (
        <PersonProperty
          ariaLabel="Author"
          options={authorOptions}
          readOnly={readOnly || !onItemAuthorChange}
          value={item.authorId}
          variant="plain"
          onValueChange={(authorId) => onItemAuthorChange?.(item.id, authorId)}
        />
      ) : null}
      {item.dueDate !== undefined ? (
        <DateProperty
          ariaLabel="Due date"
          className={checklistDueDateVariants({ status })}
          displayLabel={formatChecklistDueDate(
            item.dueDate,
            locale,
            timeZone,
            dueDayOffset,
          )}
          fallback="No due date"
          isOverdue={status === 'overdue'}
          locale={locale}
          readOnly={readOnly || !onItemDueDateChange}
          timeZone={timeZone}
          value={item.dueDate}
          variant="plain"
          onValueChange={(dueDate) => onItemDueDateChange?.(item.id, dueDate)}
        />
      ) : null}
    </span>
  )
}
