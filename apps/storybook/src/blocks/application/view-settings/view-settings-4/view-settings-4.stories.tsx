import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ViewSettings4 as ViewSettings4Block,
  type ViewSettingsDensity,
} from '@tc96/ui/blocks/application/view-settings/view-settings-4'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type BoardMode,
  boardModes,
  noFilterValues,
  type TaskSort,
  taskFiltersWithIcons,
  taskSortOptionsWithIcons,
  ViewSettingsToolbar,
} from '../fixtures/view-settings.tsx'

function IconOptionsSettings() {
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
    <ViewSettings4Block
      density={density}
      filters={taskFiltersWithIcons}
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
      sortOptions={taskSortOptionsWithIcons}
    />
  )
}

const meta = {
  component: IconOptionsSettings,
  decorators: [ViewSettingsToolbar],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/ViewSettings/ViewSettings4',
} satisfies Meta<typeof IconOptionsSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ViewSettings4: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The content of `ViewSettings2` with an icon on every submenu option: the density, the sort and each filter value.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    await userEvent.click(menu.getByRole('menuitem', { name: /Status/ }))
    const option = await screen.findByRole('menuitemcheckbox', {
      name: 'A fazer',
    })
    await expect(option.querySelector('svg')).not.toBeNull()
  },
}
