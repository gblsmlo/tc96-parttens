import {
  CalendarDotsIcon,
  CalendarIcon,
  CellSignalHighIcon,
  ClockCounterClockwiseIcon,
  FunnelSimpleIcon,
  KanbanIcon,
  ListBulletsIcon,
  type Icon as PhosphorIcon,
  RadioButtonIcon,
  RowsIcon,
  SortAscendingIcon,
  StackIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Action,
  CollectionSearchField,
  CollectionToolbar,
  CollectionToolbarGroup,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
  type ViewSettingsOption,
  ViewSettingsSection,
  ViewSettingsSubmenu,
} from '@tc96/ui/patterns'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { type ReactNode, useState } from 'react'
import {
  assigneeOptions,
  priorityOptions,
  statusOptions,
  type TaskAssignee,
  type TaskPriority,
  type TaskStatus,
} from '../view-settings-menu/view-settings-menu-data.tsx'

type TaskView = 'board' | 'list' | 'timeline'

type TaskSort = 'due' | 'priority' | 'updated'

type TaskGrouping = 'assignee' | 'none' | 'priority' | 'status'

const views: readonly { icon: PhosphorIcon; label: string; value: TaskView }[] =
  [
    { icon: ListBulletsIcon, label: 'Lista', value: 'list' },
    { icon: KanbanIcon, label: 'Quadro', value: 'board' },
    { icon: CalendarIcon, label: 'Cronograma', value: 'timeline' },
  ]

const sortOptions: readonly ViewSettingsOption<TaskSort>[] = [
  {
    icon: <CalendarDotsIcon aria-hidden="true" />,
    label: 'Prazo',
    value: 'due',
  },
  {
    icon: <CellSignalHighIcon aria-hidden="true" />,
    label: 'Prioridade',
    value: 'priority',
  },
  {
    icon: <ClockCounterClockwiseIcon aria-hidden="true" />,
    label: 'Atualização',
    value: 'updated',
  },
]

const groupingOptions: readonly ViewSettingsOption<TaskGrouping>[] = [
  { icon: <RowsIcon aria-hidden="true" />, label: 'Nenhum', value: 'none' },
  {
    icon: <RadioButtonIcon aria-hidden="true" />,
    label: 'Status',
    value: 'status',
  },
  {
    icon: <CellSignalHighIcon aria-hidden="true" />,
    label: 'Prioridade',
    value: 'priority',
  },
  {
    icon: <UserIcon aria-hidden="true" />,
    label: 'Responsável',
    value: 'assignee',
  },
]

interface IconMenuProps {
  children: ReactNode
  icon: PhosphorIcon
  label: string
  trailing?: ReactNode
}

const IconMenu = ({
  children,
  icon: Icon,
  label,
  trailing,
}: Readonly<IconMenuProps>) => (
  <Menu>
    <MenuTrigger
      render={
        <ToolbarButton
          render={
            <Button
              aria-label={label}
              size={trailing ? 'default' : 'icon'}
              type="button"
              variant="ghost"
            />
          }
        />
      }
    >
      <Icon aria-hidden="true" />
      {trailing}
    </MenuTrigger>
    <MenuPopup align="end">{children}</MenuPopup>
  </Menu>
)

interface OptionsMenuProps<TValue extends string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly ViewSettingsOption<TValue>[]
  section: string
  value: TValue
}

const OptionsMenu = <TValue extends string>({
  icon,
  label,
  onValueChange,
  options,
  section,
  value,
}: Readonly<OptionsMenuProps<TValue>>) => (
  <IconMenu icon={icon} label={label}>
    <ViewSettingsSection label={section}>
      <MenuRadioGroup
        onValueChange={(next: TValue) => onValueChange(next)}
        value={value}
      >
        {options.map((option) => (
          <MenuRadioItem key={option.value} value={option.value}>
            {option.icon}
            {option.label}
          </MenuRadioItem>
        ))}
      </MenuRadioGroup>
    </ViewSettingsSection>
  </IconMenu>
)

export function ViewMenusToolbar() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TaskStatus | undefined>('in-progress')
  const [priority, setPriority] = useState<TaskPriority | undefined>('high')
  const [assignee, setAssignee] = useState<TaskAssignee | undefined>('ana')
  const [view, setView] = useState<TaskView>('list')
  const [sort, setSort] = useState<TaskSort>('due')
  const [grouping, setGrouping] = useState<TaskGrouping>('none')

  const activeFilterCount = [status, priority, assignee].filter(Boolean).length

  const clearFilters = () => {
    setStatus(undefined)
    setPriority(undefined)
    setAssignee(undefined)
  }

  return (
    <CollectionToolbar
      aria-label="Controles das tarefas"
      left={
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>Todas as tarefas</CollectionToolbarTitle>
        </CollectionToolbarHeading>
      }
      right={
        <>
          <CollectionSearchField
            label="Buscar tarefas"
            onCommit={setSearch}
            placeholder="Buscar tarefas"
            value={search}
          />
          <IconMenu
            icon={FunnelSimpleIcon}
            label="Filtrar"
            trailing={
              activeFilterCount > 0 ? (
                <Badge aria-hidden="true">{activeFilterCount}</Badge>
              ) : undefined
            }
          >
            <ViewSettingsSection label="Propriedades">
              <ViewSettingsSubmenu
                icon={RadioButtonIcon}
                label="Status"
                onValueChange={setStatus}
                options={statusOptions}
                value={status}
              />
              <ViewSettingsSubmenu
                icon={CellSignalHighIcon}
                label="Prioridade"
                onValueChange={setPriority}
                options={priorityOptions}
                value={priority}
              />
              <ViewSettingsSubmenu
                icon={UserIcon}
                label="Responsável"
                onValueChange={setAssignee}
                options={assigneeOptions}
                value={assignee}
              />
            </ViewSettingsSection>
            <MenuSeparator />
            <MenuItem disabled={activeFilterCount === 0} onClick={clearFilters}>
              Limpar filtros
            </MenuItem>
          </IconMenu>
          <CollectionToolbarGroup aria-label="Visualização">
            <ToggleGroup
              onValueChange={(value) => {
                const next = value[0] as TaskView | undefined
                if (next) setView(next)
              }}
              size="default"
              value={[view]}
            >
              {views.map(({ icon: Icon, label, value }) => (
                <ToolbarButton
                  key={value}
                  render={<ToggleGroupItem aria-label={label} value={value} />}
                >
                  <Icon aria-hidden="true" />
                </ToolbarButton>
              ))}
            </ToggleGroup>
          </CollectionToolbarGroup>
          <OptionsMenu
            icon={SortAscendingIcon}
            label="Ordenar"
            onValueChange={setSort}
            options={sortOptions}
            section="Ordenar por"
            value={sort}
          />
          <OptionsMenu
            icon={StackIcon}
            label="Agrupar"
            onValueChange={setGrouping}
            options={groupingOptions}
            section="Agrupar por"
            value={grouping}
          />
          <Action label="Nova tarefa" onClick={() => undefined} />
        </>
      }
    />
  )
}
