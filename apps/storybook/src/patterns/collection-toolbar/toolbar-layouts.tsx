import {
  ArrowsDownUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ShapesIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { MenuSeparator } from '@tc96/ui/menu'
import {
  Action,
  addCalendarDays,
  type CalendarDate,
  type CalendarViewMode,
  CollectionSearchField,
  CollectionToolbar,
  CollectionToolbarDescription,
  CollectionToolbarGroup,
  CollectionToolbarHeading,
  type CollectionToolbarProps,
  CollectionToolbarTitle,
  calendarRange,
  FilterRadioSubmenu,
  toZonedDateTime,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { Text } from '@tc96/ui/text'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { useState } from 'react'
import { Slot } from '../../test-utils/anatomy-slot'
import { viewSettingsControlArgs } from '../view-settings-menu/view-settings-menu-controls.ts'
import {
  spreadsheetModes,
  viewModes,
} from '../view-settings-menu/view-settings-menu-data.tsx'
import { ComposedViewSettings } from '../view-settings-menu/view-settings-menu-layouts.tsx'
import { viewSwitcherControlArgs } from '../view-switcher/view-switcher-controls.ts'
import {
  ComposedViewSwitcher,
  type ComposedViewSwitcherProps,
} from '../view-switcher/view-switcher-layouts.tsx'
import type { ToolbarControls } from './toolbar-controls.ts'

const ignore = () => undefined

export interface ComposedToolbarProps extends ToolbarControls {
  switcher?: Partial<ComposedViewSwitcherProps>
}

export function ComposedToolbar({
  ariaLabel,
  center,
  description,
  left,
  right,
  switcher,
  mode,
  title,
}: Readonly<ComposedToolbarProps>) {
  const [searchValue, setSearchValue] = useState('')
  const settingsMenu = (
    <ComposedViewSettings {...viewSettingsControlArgs} modes={viewModes} />
  )

  const searchField = (
    <CollectionSearchField
      label="Buscar tarefas"
      onCommit={setSearchValue}
      placeholder="Buscar tarefas"
      value={searchValue}
    />
  )

  const heading = (
    <CollectionToolbarHeading>
      <CollectionToolbarTitle>{title}</CollectionToolbarTitle>
      <CollectionToolbarDescription>{description}</CollectionToolbarDescription>
    </CollectionToolbarHeading>
  )

  const leftContent = {
    heading,
    none: undefined,
    search: center === 'search' ? undefined : searchField,
    switcher: (
      <ComposedViewSwitcher {...viewSwitcherControlArgs} {...switcher} />
    ),
  }[left]

  const action = <Action label="Nova tarefa" onClick={ignore} />

  const rightContent = {
    action,
    none: undefined,
    settings: settingsMenu,
    'settings-and-action': (
      <>
        {settingsMenu}
        {action}
      </>
    ),
  }[right]

  return (
    <CollectionToolbar
      aria-label={ariaLabel}
      center={center === 'search' ? searchField : undefined}
      className={left === 'heading' ? 'min-h-14' : undefined}
      left={leftContent}
      mode={mode}
      right={rightContent}
    />
  )
}

export function SearchFieldToolbar() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name_asc')
  const [type, setType] = useState('')
  const activeFilterCount = [search, type].filter(Boolean).length

  return (
    <CollectionToolbar
      right={
        <>
          <ViewSettingsMenu
            activeFilterCount={activeFilterCount}
            onClearFilters={() => {
              setSearch('')
              setType('')
            }}
          >
            <ViewSettingsSection label="Exibição">
              <FilterRadioSubmenu
                clearLabel="Nome (A–Z)"
                icon={ArrowsDownUpIcon}
                label="Ordenar por"
                onValueChange={(value) => setSort(value || 'name_asc')}
                options={[
                  ['name_desc', 'Nome (Z–A)'],
                  ['created_desc', 'Mais recentes'],
                ]}
                value={sort === 'name_asc' ? '' : sort}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <ViewSettingsSection label="Filtros">
              <FilterRadioSubmenu
                icon={ShapesIcon}
                label="Tipo"
                onValueChange={setType}
                options={[
                  ['person', 'Pessoa'],
                  ['organization', 'Organização'],
                ]}
                value={type}
              />
            </ViewSettingsSection>
          </ViewSettingsMenu>
          <Action label="Novo contato" onClick={ignore} />
        </>
      }
      left={
        <CollectionSearchField
          label="Buscar contatos"
          onCommit={setSearch}
          placeholder="Nome, e-mail ou telefone"
          value={search}
        />
      }
    />
  )
}

export const SpreadsheetSettingsToolbar = () => (
  <CollectionToolbar
    right={
      <ComposedViewSettings
        {...viewSettingsControlArgs}
        filters={false}
        modes={spreadsheetModes}
      />
    }
  />
)

export function GroupToolbar() {
  return (
    <CollectionToolbar
      left={
        <CollectionToolbarGroup aria-label="Atalhos de prazo">
          <ToolbarButton render={<Button variant="outline" />}>
            Hoje
          </ToolbarButton>
          <ToolbarButton render={<Button variant="outline" />}>
            Esta semana
          </ToolbarButton>
        </CollectionToolbarGroup>
      }
      right={<Action label="Nova tarefa" onClick={ignore} />}
    />
  )
}

const APPOINTMENT_LOCALE = 'pt-BR'
const APPOINTMENT_TIME_ZONE = 'America/Sao_Paulo'
const APPOINTMENT_WEEK_STARTS_ON = 1

const appointmentRangeModes: readonly {
  label: string
  value: CalendarViewMode
}[] = [
  { label: 'Dia', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
]

const isAppointmentRangeMode = (value: string): value is CalendarViewMode =>
  appointmentRangeModes.some((mode) => mode.value === value)

const appointmentMonthShort = new Intl.DateTimeFormat(APPOINTMENT_LOCALE, {
  month: 'short',
  timeZone: 'UTC',
})
const appointmentMonthYear = new Intl.DateTimeFormat(APPOINTMENT_LOCALE, {
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
})

const asUtcDate = (date: CalendarDate) =>
  new Date(Date.UTC(date.year, date.month - 1, date.day))

const shiftAppointmentDate = (
  date: CalendarDate,
  mode: CalendarViewMode,
  step: -1 | 1,
): CalendarDate => {
  if (mode === 'day') return addCalendarDays(date, step)
  if (mode === 'week') return addCalendarDays(date, step * 7)
  return addCalendarDays({ ...date, day: 1, month: date.month + step }, 0)
}

export const appointmentToday = (): CalendarDate =>
  toZonedDateTime(new Date(), APPOINTMENT_TIME_ZONE).date

export const formatAppointmentPeriod = (
  date: CalendarDate,
  mode: CalendarViewMode,
) => {
  if (mode === 'day') {
    return `${date.day} de ${appointmentMonthShort.format(asUtcDate(date))}`
  }
  if (mode === 'month') {
    return appointmentMonthYear.format(asUtcDate(date))
  }
  const range = calendarRange(date, 'week', APPOINTMENT_WEEK_STARTS_ON)
  const first = range[0] ?? date
  const last = range[range.length - 1] ?? date
  const lastMonth = appointmentMonthShort.format(asUtcDate(last))
  if (first.month === last.month && first.year === last.year) {
    return `${first.day} – ${last.day} de ${lastMonth}`
  }
  const firstMonth = appointmentMonthShort.format(asUtcDate(first))
  if (first.year === last.year) {
    return `${first.day} de ${firstMonth} – ${last.day} de ${lastMonth}`
  }
  return `${first.day} de ${firstMonth} de ${first.year} – ${last.day} de ${lastMonth} de ${last.year}`
}

export function AppointmentsToolbar() {
  const [anchor, setAnchor] = useState(appointmentToday)
  const [mode, setMode] = useState<CalendarViewMode>('week')

  return (
    <CollectionToolbar
      aria-label="Controles da agenda"
      center={
        <ToggleGroup
          aria-label="Período"
          onValueChange={(next) => {
            const [value] = next as string[]
            if (value && isAppointmentRangeMode(value)) setMode(value)
          }}
          value={[mode]}
        >
          {appointmentRangeModes.map((option) => (
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
      left={
        <div className="flex min-w-0 items-center gap-2">
          <ToolbarButton
            onClick={() => setAnchor(appointmentToday())}
            render={<Button variant="secondary" />}
          >
            Hoje
          </ToolbarButton>
          <ToolbarButton
            aria-label="Período anterior"
            onClick={() => setAnchor(shiftAppointmentDate(anchor, mode, -1))}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <CaretLeftIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton
            aria-label="Próximo período"
            onClick={() => setAnchor(shiftAppointmentDate(anchor, mode, 1))}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <CaretRightIcon aria-hidden="true" />
          </ToolbarButton>
          <Text
            aria-live="polite"
            className="min-w-0 first-letter:uppercase"
            render={<p />}
            size="sm"
            truncate
            weight="medium"
          >
            {formatAppointmentPeriod(anchor, mode)}
          </Text>
        </div>
      }
      right={<Action label="Novo compromisso" onClick={ignore} />}
    />
  )
}

type SlotsProps = Readonly<Pick<CollectionToolbarProps, 'mode'>>

export const DefaultSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    left={<Slot name="left" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const LeftCenterRightSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    center={<Slot name="center" />}
    left={<Slot name="left" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const CenterAndRightSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    center={<Slot name="center" />}
    mode={mode}
    right={<Slot name="right" />}
  />
)

export const RightSideSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar mode={mode} right={<Slot name="right" />} />
)

const viewMenuSlots = [
  'search',
  'filter',
  'view switcher',
  'sort',
  'group',
  'action',
] as const

export const HeadingAndViewMenusSlots = ({ mode }: SlotsProps) => (
  <CollectionToolbar
    left={<Slot name="heading" />}
    mode={mode}
    right={viewMenuSlots.map((name) => <Slot key={name} name={name} />)}
  />
)
