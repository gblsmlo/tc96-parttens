'use client'

import { Text } from '@tc96/ui/text'
import type { ReactElement, ReactNode } from 'react'
import { ChecklistCount } from './checklist-count'

export function ChecklistHeader({
  completed,
  title,
  total,
}: Readonly<{
  completed: number
  title: ReactNode
  total: number
}>): ReactElement | null {
  if (title == null) return null

  return (
    <div className="flex items-center gap-2" data-slot="checklist-header">
      <Text size="sm" weight="medium">
        {title}
      </Text>
      {total > 0 ? (
        <ChecklistCount completed={completed} meter total={total} />
      ) : null}
    </div>
  )
}
