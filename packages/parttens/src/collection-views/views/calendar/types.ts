import type {
  CalendarDate,
  CalendarRangeMode,
} from '@tc96/helpers/calendar-date'

export type { CalendarDate } from '@tc96/helpers/calendar-date'

export type CalendarViewMode = CalendarRangeMode

export interface CalendarItemSchedule {
  /** `null` é o instante único (item só com prazo); o time grid dá altura mínima. */
  end: Date | null
  isAllDay: boolean
  start: Date
}

export type CalendarItemPlacement = 'all-day' | 'month' | 'time-grid'

export interface CalendarItemRenderContext {
  /** Dia do segmento — item multi-dia é fatiado em um segmento por dia. */
  date: CalendarDate
  /** Minutos do fim do segmento dentro do dia; `null` fora do time grid. */
  endMinutes: number | null
  /** O segmento contém o fim real do item. */
  isEnd: boolean
  /** O segmento contém o início real do item. */
  isStart: boolean
  placement: CalendarItemPlacement
  /** Minutos do início do segmento dentro do dia; `null` fora do time grid. */
  startMinutes: number | null
}

export interface CalendarItemReschedule<TItem = unknown> {
  end: Date | null
  isAllDay: boolean
  item: TItem
  itemKey: string
  /** Janela original no momento em que a interação começou. */
  sourceEnd: Date | null
  sourceStart: Date
  start: Date
}
