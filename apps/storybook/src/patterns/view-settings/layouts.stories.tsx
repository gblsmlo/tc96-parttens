import type { Meta, StoryObj } from '@storybook/react-vite'
import { screen, userEvent, within } from 'storybook/test'
import { ViewSettingsCanvas } from './view-settings-canvas.tsx'
import { viewSettingsControlArgs } from './view-settings-controls.ts'
import {
  ComposedViewSettings,
  FieldSettingsLayout,
  InlineModeTabsLayout,
  StackedModeTabsLayout,
} from './view-settings-layouts.tsx'

const meta = {
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettings/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

export const Default: Story = {
  render: () => <ComposedViewSettings {...viewSettingsControlArgs} />,
}

export const InlineModeTabs: Story = {
  parameters: describe(
    'Up to three layout tabs in one row above the sections, each with its icon beside the label. For a collection shown in two or three layouts.',
  ),
  render: () => <InlineModeTabsLayout {...viewSettingsControlArgs} />,
}

export const StackedModeTabs: Story = {
  parameters: describe(
    'Four or more layout tabs above the sections, each with its icon above the label, in a wider menu. For a collection shown in four layouts or more.',
  ),
  render: () => <StackedModeTabsLayout {...viewSettingsControlArgs} />,
}

export const FieldSettings: Story = {
  parameters: describe(
    'The fields of a collection grouped and sorted by two separate submenus, Agrupar por (none, type, visibility) and Ordenar por (manual, name A-Z, name Z-A), each showing its current value. The name order applies inside each group; every row has a switch that shows or hides the field.',
  ),
  render: () => <FieldSettingsLayout {...viewSettingsControlArgs} />,
}

export const FieldSettingsOpen: Story = {
  parameters: describe(
    'The field settings with the menu open, to see the whole structure at once: the layout tabs, the two submenus, the Visíveis and Ocultos groups with their counts, and the footer.',
  ),
  render: () => <FieldSettingsLayout {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    await screen.findByRole('menu')
  },
}
