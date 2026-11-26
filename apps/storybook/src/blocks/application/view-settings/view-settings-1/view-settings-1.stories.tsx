import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ViewSettings1 as ViewSettings1Block,
  type ViewSettingsDensity,
} from '@tc96/ui/blocks/application/view-settings/view-settings-1'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  noFilterValues,
  type TaskSort,
  taskFilters,
  taskSortOptions,
  ViewSettingsToolbar,
} from '../fixtures/view-settings.tsx'

function TaskListSettings() {
  const [density, setDensity] = useState<ViewSettingsDensity>('comfortable')
  const [sort, setSort] = useState<TaskSort>('due')
  const [filterValues, setFilterValues] = useState(noFilterValues)
  const modified =
    density !== 'comfortable' ||
    sort !== 'due' ||
    Object.values(filterValues).some((values) => values.length > 0)

  return (
    <ViewSettings1Block
      density={density}
      filters={taskFilters}
      filterValues={filterValues}
      onClearFilters={() => setFilterValues(noFilterValues)}
      onDensityChange={setDensity}
      onFilterValuesChange={setFilterValues}
      onReset={() => {
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
  component: TaskListSettings,
  decorators: [ViewSettingsToolbar],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/ViewSettings/ViewSettings1',
} satisfies Meta<typeof TaskListSettings>

export default meta

type Story = StoryObj<typeof meta>

export const ViewSettings1: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A task list with a single layout: Exibição holds the density and the sort, Filtros the status, assignee, priority, tags and due date, then Limpar filtros, Redefinir and Salvar preferência.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    await expect(menu.getByText('Filtros')).toBeVisible()
    await expect(menu.queryByRole('menuitemradio')).toBeNull()
  },
}
