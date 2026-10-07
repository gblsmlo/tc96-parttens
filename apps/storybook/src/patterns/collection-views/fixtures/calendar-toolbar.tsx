import {
  Action,
  addCalendarDays,
  type CalendarDate,
  type CalendarViewMode,
  CollectionToolbar,
  calendarRange,
  fromZonedDateTime,
  MenuCheckboxOption,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { TIME_ZONE } from './tasks'

export const CALENDAR_LOCALE = 'pt-BR'
export const CALENDAR_WEEK_STARTS_ON = 1

export const rangeModes: readonly { label: string; value: CalendarViewMode }[] =
  [
    { label: 'Dia', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Mês', value: 'month' },
  ]

const isRangeMode = (value: string): value is CalendarViewMode =>
  rangeModes.some((mode) => mode.value === value)

export const toAnchor = (date: CalendarDate) =>
  fromZonedDateTime({ date, minutes: 12 * 60 }, TIME_ZONE)

const shiftDate = (
  date: CalendarDate,
  mode: CalendarViewMode,
  step: -1 | 1,
): CalendarDate => {
  if (mode === 'day') return addCalendarDays(date, step)
  if (mode === 'week') return addCalendarDays(date, step * 7)
  return addCalendarDays({ ...date, day: 1, month: date.month + step }, 0)
}

const asUtcDate = (date: CalendarDate) =>
  new Date(Date.UTC(date.year, date.month - 1, date.day))

const dayFormatter = new Intl.DateTimeFormat(CALENDAR_LOCALE, {
  dateStyle: 'full',
  timeZone: 'UTC',
})
const weekFormatter = new Intl.DateTimeFormat(CALENDAR_LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  year: 'numeric',
})
const monthFormatter = new Intl.DateTimeFormat(CALENDAR_LOCALE, {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const formatPeriod = (date: CalendarDate, mode: CalendarViewMode) => {
  if (mode === 'day') return dayFormatter.format(asUtcDate(date))
  if (mode === 'month') return monthFormatter.format(asUtcDate(date))
  const range = calendarRange(date, 'week', CALENDAR_WEEK_STARTS_ON)
  const first = range[0] ?? date
  const last = range[range.length - 1] ?? date
  return weekFormatter.formatRange(asUtcDate(first), asUtcDate(last))
}

export const toggleValue = <TValue,>(
  values: readonly TValue[],
  value: TValue,
) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

export interface FilterCheckboxSubmenuProps<TValue extends string> {
  icon: LucideIcon
  label: string
  onToggle: (value: TValue) => void
  options: readonly { label: string; value: TValue }[]
  selected: readonly TValue[]
}

export function FilterCheckboxSubmenu<TValue extends string>({
  icon: Icon,
  label,
  onToggle,
  options,
  selected,
}: Readonly<FilterCheckboxSubmenuProps<TValue>>) {
  return (
    <MenuSub>
      <MenuSubTrigger>
        <Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuGroup>
          <MenuGroupLabel>{label}</MenuGroupLabel>
          {options.map((option) => (
            <MenuCheckboxOption
              checked={selected.includes(option.value)}
              closeOnClick={false}
              key={option.value}
              onCheckedChange={() => onToggle(option.value)}
            >
              {option.label}
            </MenuCheckboxOption>
          ))}
        </MenuGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}

export interface CalendarToolbarProps {
  activeFilterCount: number
  'aria-label': string
  anchorDate: CalendarDate
  createLabel: string
  filters: ReactNode
  mode: CalendarViewMode
  onAnchorChange: (anchor: Date) => void
  onClearFilters: () => void
  onModeChange: (mode: CalendarViewMode) => void
  today: Date
}

export function CalendarToolbar({
  activeFilterCount,
  'aria-label': ariaLabel,
  anchorDate,
  createLabel,
  filters,
  mode,
  onAnchorChange,
  onClearFilters,
  onModeChange,
  today,
}: Readonly<CalendarToolbarProps>) {
  return (
    <CollectionToolbar
      aria-label={ariaLabel}
      centerSlot={
        <ToggleGroup
          aria-label="Período"
          onValueChange={(next) => {
            const [value] = next as string[]
            if (value && isRangeMode(value)) onModeChange(value)
          }}
          value={[mode]}
        >
          {rangeModes.map((option) => (
            <ToggleGroupItem
              key={option.value}
              render={
                <Button
                  size="sm"
                  variant={option.value === mode ? 'secondary' : 'ghost'}
                />
              }
              value={option.value}
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
      endSlot={
        <>
          <ViewSettingsMenu
            activeFilterCount={activeFilterCount}
            onClearFilters={onClearFilters}
          >
            <ViewSettingsSection label="Filtros">{filters}</ViewSettingsSection>
          </ViewSettingsMenu>
          <Action label={createLabel} onClick={() => undefined} />
        </>
      }
      startSlot={
        <div className="flex min-w-0 items-center gap-2">
          <Button
            onClick={() => onAnchorChange(today)}
            size="sm"
            variant="secondary"
          >
            Hoje
          </Button>
          <Button
            aria-label="Período anterior"
            onClick={() =>
              onAnchorChange(toAnchor(shiftDate(anchorDate, mode, -1)))
            }
            size="icon-sm"
            variant="ghost"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>
          <Button
            aria-label="Próximo período"
            onClick={() =>
              onAnchorChange(toAnchor(shiftDate(anchorDate, mode, 1)))
            }
            size="icon-sm"
            variant="ghost"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
          <p
            aria-live="polite"
            className="truncate font-medium text-sm first-letter:uppercase"
            data-slot="calendar-period"
          >
            {formatPeriod(anchorDate, mode)}
          </p>
        </div>
      }
      variant="plain"
    />
  )
}
