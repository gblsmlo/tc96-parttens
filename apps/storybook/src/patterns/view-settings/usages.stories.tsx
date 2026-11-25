import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { ViewSettingsCanvas } from './view-settings-canvas.tsx'
import { viewSettingsControlArgs } from './view-settings-controls.ts'
import { spreadsheetModes } from './view-settings-data.tsx'
import {
  ComposedViewSettings,
  InlineModeTabsLayout,
  StackedModeTabsLayout,
} from './view-settings-layouts.tsx'

const meta = {
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettings/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

const expectTrigger = async (canvasElement: HTMLElement) => {
  await expect(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  ).toBeVisible()
}

export const TaskList: Story = {
  parameters: describe(
    'A task list with a single layout, on the [Default](?path=/story/patterns-viewsettings-layouts--default) layout: Exibição holds the density and the sort, Filtros the status, assignee, priority, tags and due date, then Limpar filtros and Salvar preferência.',
  ),
  render: () => <ComposedViewSettings {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => expectTrigger(canvasElement),
}

export const TaskBoard: Story = {
  parameters: describe(
    'A task board shown as Kanban, Lista or Tabela, on the [Inline Mode Tabs](?path=/story/patterns-viewsettings-layouts--inline-mode-tabs) layout, with the same sections as the task list.',
  ),
  render: () => <InlineModeTabsLayout {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => expectTrigger(canvasElement),
}

export const Spreadsheet: Story = {
  parameters: describe(
    'A spreadsheet shown as Tabela, Kanban or Planilha, on the [Inline Mode Tabs](?path=/story/patterns-viewsettings-layouts--inline-mode-tabs) layout: only the display section, with no filters and no clear item.',
  ),
  render: () => (
    <ComposedViewSettings
      {...viewSettingsControlArgs}
      clear={false}
      filters={false}
      modes={spreadsheetModes}
    />
  ),
  play: async ({ canvasElement }) => expectTrigger(canvasElement),
}

export const Agenda: Story = {
  parameters: describe(
    'An agenda shown as Kanban, Lista, Tabela or Agenda, on the [Stacked Mode Tabs](?path=/story/patterns-viewsettings-layouts--stacked-mode-tabs) layout, with the display and filter sections.',
  ),
  render: () => <StackedModeTabsLayout {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => expectTrigger(canvasElement),
}
