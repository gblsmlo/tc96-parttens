'use client'

import { parseCalendarDateKey } from '@tc96/helpers/calendar-date'
import type { ReactNode } from 'react'
import { memo } from 'react'
import type {
  CalendarItemPlacement,
  CalendarRecordRenderContext,
} from '../types'

interface CalendarSegmentContentProps<TRecord> {
  dateKey: string
  endMinutes: number | null
  isEnd: boolean
  isStart: boolean
  record: TRecord
  placement: CalendarItemPlacement
  renderRecord: (
    record: TRecord,
    context: CalendarRecordRenderContext,
  ) => ReactNode
  startMinutes: number | null
}

function CalendarSegmentContentImpl<TRecord>({
  dateKey,
  endMinutes,
  isEnd,
  isStart,
  record,
  placement,
  renderRecord,
  startMinutes,
}: CalendarSegmentContentProps<TRecord>) {
  const date = parseCalendarDateKey(dateKey)
  if (!date) return null

  return renderRecord(record, {
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
