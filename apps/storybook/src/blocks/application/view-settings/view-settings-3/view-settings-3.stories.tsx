import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ViewSettings3 as ViewSettings3Block,
  type ViewSettingsDensity,
} from '@tc96/ui/blocks/application/view-settings/view-settings-3'
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

function StackedBoardSettings() {
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
    <ViewSettings3Block
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
  component: StackedBoardSettings,
  decorators: [ViewSettingsToolbar],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/ViewSettings/ViewSettings3',
} satisfies Meta<typeof StackedBoardSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ViewSettings3: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The structure of `ViewSettings2` with the layout tabs stacked, each icon above its label, even with three layouts.',
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
