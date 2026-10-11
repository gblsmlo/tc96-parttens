import {
  formatShortDate,
  parseIsoDate,
  serializeIsoDay,
} from '@tc96/helpers/date'

export function formatDateProperty(
  value: string | null,
  fallback: string,
  locale: string,
  timeZone: string,
): string {
  const date = parseIsoDate(value)
  return date ? formatShortDate(date, locale, timeZone) : fallback
}

export function parseDatePropertyValue(value: string | null): Date | null {
  return parseIsoDate(value)
}

export function serializeDatePropertyValue(date: Date): string {
  return serializeIsoDay(date)
}
