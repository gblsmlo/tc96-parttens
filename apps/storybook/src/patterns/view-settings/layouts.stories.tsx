import type { Meta, StoryObj } from '@storybook/react-vite'
import { ViewSettingsCanvas } from './view-settings-canvas.tsx'
import { viewSettingsControlArgs } from './view-settings-controls.ts'
import {
  ComposedViewSettings,
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
