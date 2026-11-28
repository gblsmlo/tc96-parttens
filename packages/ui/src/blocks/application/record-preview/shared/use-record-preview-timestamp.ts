import { parseIsoDate } from '@tc96/ui/helpers/date'
import { useMemo } from 'react'

export function useRecordPreviewTimestamp(locale: string, timeZone?: string) {
  return useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      timeZone,
      year: 'numeric',
    })
    return (value: string | null) => {
      const date = parseIsoDate(value)
      return date ? formatter.format(date) : undefined
    }
  }, [locale, timeZone])
}
