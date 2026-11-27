import {
  CellSignalHighIcon,
  CubeIcon,
  RadioButtonIcon,
  RowsIcon,
  UserCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ViewSettings5 as ViewSettings5Block,
  type ViewSettings5Filter,
  type ViewSettings5FilterValues,
} from '@tc96/ui/blocks/application/view-settings/view-settings-5'
import {
  type PriorityLevel,
  PropertyMetaIcon,
  priorityMeta,
  type WorkflowStatus,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type BoardMode,
  boardModes,
  type TaskSort,
  taskSortOptionsWithIcons,
  ViewSettingsToolbar,
} from '../fixtures/view-settings.tsx'

const statuses: readonly [WorkflowStatus, string][] = [
  ['todo', 'A fazer'],
  ['in-progress', 'Em andamento'],
  ['done', 'Concluído'],
]

const priorities: readonly [PriorityLevel, string][] = [
  ['urgent', 'Urgente'],
  ['high', 'Alta'],
  ['medium', 'Média'],
  ['low', 'Baixa'],
]

const filters: readonly ViewSettings5Filter[] = [
  {
    icon: RadioButtonIcon,
    id: 'status',
    label: 'Status',
    options: statuses.map(([value, label]) => ({
      icon: (
        <PropertyMetaIcon className="size-4" meta={workflowStatusMeta[value]} />
      ),
      label,
      value,
    })),
  },
  {
    icon: CellSignalHighIcon,
    id: 'priority',
    label: 'Prioridade',
    options: priorities.map(([value, label]) => ({
      icon: <PropertyMetaIcon className="size-4" meta={priorityMeta[value]} />,
      label,
      value,
    })),
  },
  {
    icon: UserIcon,
    id: 'assignee',
    label: 'Responsável',
    options: ['Ana Souza', 'Bruno Lima'].map((label) => ({
      icon: <UserCircleIcon aria-hidden="true" />,
      label,
      value: label,
    })),
  },
]

type TaskGroup = 'none' | 'priority' | 'project' | 'status'

const groupOptions = [
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
  { icon: <CubeIcon aria-hidden="true" />, label: 'Projeto', value: 'project' },
] as const

const noFilters: ViewSettings5FilterValues = {}

function TaskViewSettings() {
  const [mode, setMode] = useState<BoardMode>('list')
  const [sort, setSort] = useState<TaskSort>('due')
  const [groupBy, setGroupBy] = useState<TaskGroup>('status')
  const [filterValues, setFilterValues] = useState(noFilters)

  return (
    <ViewSettings5Block
      filters={filters}
      filterValues={filterValues}
      groupBy={groupBy}
      groupOptions={groupOptions}
      mode={mode}
      modes={boardModes}
      onClearFilters={() => setFilterValues(noFilters)}
      onFilterValuesChange={setFilterValues}
      onGroupByChange={setGroupBy}
      onModeChange={setMode}
      onSortChange={setSort}
      sort={sort}
      sortOptions={taskSortOptionsWithIcons}
    />
  )
}

const meta = {
  component: TaskViewSettings,
  decorators: [ViewSettingsToolbar],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/ViewSettings/ViewSettings5',
} satisfies Meta<typeof TaskViewSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ViewSettings5: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The view settings as one menu per setting: the filter with its count, the layout showing the current layout icon, the sort and the grouping.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Filtrar' }))
    await userEvent.click(
      await screen.findByRole('menuitem', { name: /Status/ }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'A fazer' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Filtrar, 1 filtro ativo' }),
    ).toBeVisible()
  },
}
