'use client'

import { parseCalendarDateKey } from '@tc96/helpers/calendar-date'
import type { ReactNode } from 'react'
import { memo } from 'react'
import type { CalendarItemPlacement, CalendarItemRenderContext } from '../types'

interface CalendarSegmentContentProps<TItem> {
  dateKey: string
  endMinutes: number | null
  isEnd: boolean
  isStart: boolean
  item: TItem
  placement: CalendarItemPlacement
  renderItem: (item: TItem, context: CalendarItemRenderContext) => ReactNode
  startMinutes: number | null
}

function CalendarSegmentContentImpl<TItem>({
  dateKey,
  endMinutes,
  isEnd,
  isStart,
  item,
  placement,
  renderItem,
  startMinutes,
}: CalendarSegmentContentProps<TItem>) {
  const date = parseCalendarDateKey(dateKey)
  if (!date) return null

  return renderItem(item, {
    date,
    endMinutes,
    isEnd,
    isStart,
    placement,
    startMinutes,
  })
}

export const CalendarSegmentContent = memo(
  CalendarSegmentContentImpl,
) as typeof CalendarSegmentContentImpl
