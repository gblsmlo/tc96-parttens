import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ViewSettings2 as ViewSettings2Block,
  type ViewSettingsDensity,
} from '@tc96/ui/blocks/application/view-settings/view-settings-2'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type BoardMode,
  boardModes,
  noFilterValues,
  type TaskSort,
  taskFilters,
  taskSortOptions,
  ViewSettingsToolbar,
} from '../fixtures/view-settings.tsx'

function TaskBoardSettings() {
  const [mode, setMode] = useState<BoardMode>('kanban')
  const [density, setDensity] = useState<ViewSettingsDensity>('comfortable')
  const [sort, setSort] = useState<TaskSort>('due')
  const [filterValues, setFilterValues] = useState(noFilterValues)
  const modified =
    mode !== 'kanban' ||
    density !== 'comfortable' ||
    sort !== 'due' ||
    Object.values(filterValues).some((values) => values.length > 0)

  return (
    <ViewSettings2Block
      density={density}
      filters={taskFilters}
      filterValues={filterValues}
      mode={mode}
      modes={boardModes}
      onClearFilters={() => setFilterValues(noFilterValues)}
      onDensityChange={setDensity}
      onFilterValuesChange={setFilterValues}
      onModeChange={setMode}
      onReset={() => {
        setMode('kanban')
        setDensity('comfortable')
        setSort('due')
        setFilterValues(noFilterValues)
      }}
      onSavePreference={() => undefined}
      onSortChange={setSort}
      resetDisabled={!modified}
      savePreferenceDisabled={!modified}
      sort={sort}
      sortOptions={taskSortOptions}
    />
  )
}

const meta = {
  component: TaskBoardSettings,
  decorators: [ViewSettingsToolbar],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/ViewSettings/ViewSettings2',
} satisfies Meta<typeof TaskBoardSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ViewSettings2: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A task board shown as Kanban, Lista or Tabela: the layout tabs in one row above the same sections as `ViewSettings1`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    await userEvent.click(menu.getByRole('menuitemradio', { name: 'Lista' }))
    await expect(
      menu.getByRole('menuitemradio', { name: 'Lista' }),
    ).toBeChecked()
  },
}
