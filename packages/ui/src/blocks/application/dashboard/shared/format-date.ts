import { defaultDashboardLocale } from './format'

function parseIso(value: string) {
  return new Date(value.length <= 10 ? `${value}T12:00:00Z` : value)
}

export function createDateFormatter({
  locale = defaultDashboardLocale,
  timeZone,
}: {
  locale?: string
  timeZone?: string
} = {}) {
  const dayMonth = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    timeZone,
  })
  const fullDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  })
  const weekday = new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'short',
  })
  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  })

  return {
    dayMonth: (iso: string) => dayMonth.format(parseIso(iso)),
    fullDate: (iso: string) => fullDate.format(parseIso(iso)),
    month: (isoMonth: string) =>
      month.format(new Date(`${isoMonth.slice(0, 7)}-15T12:00:00Z`)),
    time: (iso: string) => time.format(parseIso(iso)),
    weekday: (iso: string) => weekday.format(parseIso(iso)),
  }
}

export type DateFormatter = ReturnType<typeof createDateFormatter>
