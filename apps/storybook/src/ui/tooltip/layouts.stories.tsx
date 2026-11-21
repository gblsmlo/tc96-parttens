import type { Meta, StoryObj } from '@storybook/react-vite'
import { tooltipControlArgs } from './tooltip-controls.ts'
import { TooltipFrame } from './tooltip-frame.tsx'
import {
  ComposedTooltip,
  GroupedTooltips,
  SharedTooltip,
} from './tooltip-layouts.tsx'

const meta = {
  decorators: [TooltipFrame],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Tooltip/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const IconOnly: Story = {
  render: () => <ComposedTooltip {...tooltipControlArgs} iconOnly />,
}

export const WithShortcut: Story = {
  render: () => <ComposedTooltip {...tooltipControlArgs} shortcut />,
}

export const Grouped: Story = {
  render: () => <GroupedTooltips />,
}

export const SharedPopup: Story = {
  render: () => <SharedTooltip />,
}
