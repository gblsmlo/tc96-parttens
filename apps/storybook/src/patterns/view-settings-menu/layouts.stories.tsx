import type { Meta, StoryObj } from '@storybook/react-vite'
import { screen, userEvent, within } from 'storybook/test'
import { ViewSettingsCanvas } from './view-settings-menu-canvas.tsx'
import { viewSettingsControlArgs } from './view-settings-menu-controls.ts'
import {
  ComposedViewSettings,
  FieldSettingsLayout,
  InlineModeTabsLayout,
  PropertySubmenusLayout,
  StackedModeTabsLayout,
  SwitchOptionsLayout,
} from './view-settings-menu-layouts.tsx'

const meta = {
  decorators: [ViewSettingsCanvas],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/ViewSettingsMenu/Layouts',
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

export const SwitchOptions: Story = {
  parameters: describe(
    'Display options that are on or off, each a switch in one section; the menu stays open while they change. Shown open. For settings that take no value beyond on and off, such as showing completed tasks or subtasks.',
  ),
  render: () => <SwitchOptionsLayout {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    await screen.findByRole('menu')
  },
}

export const PropertySubmenus: Story = {
  parameters: describe(
    'An Exibição section with the density and the sort, then one submenu per property, each trigger with the icon and label of its current option, and each option with its own icon and a check on the chosen one. A property without a value shows only its icon and name. Shown open on Status. For a single choice per property, such as the status, priority, assignee and dates of a task.',
  ),
  render: () => <PropertySubmenusLayout {...viewSettingsControlArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Exibição' }),
    )
    const menu = within(await screen.findByRole('menu'))
    await userEvent.click(menu.getByRole('menuitem', { name: /Status/ }))
    await screen.findByRole('menuitemradio', { name: 'Backlog' })
  },
}
