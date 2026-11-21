import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TooltipControls,
  tooltipControlArgs,
  tooltipControlArgTypes,
} from './tooltip-controls.ts'
import { TooltipFrame } from './tooltip-frame.tsx'
import { ComposedTooltip } from './tooltip-layouts.tsx'

const meta = {
  args: tooltipControlArgs,
  argTypes: tooltipControlArgTypes,
  decorators: [TooltipFrame],
  parameters: {
    controls: { exclude: ['open'] },
    layout: 'centered',
  },
  render: (args) => <ComposedTooltip {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Tooltip/Stories',
} satisfies Meta<TooltipControls>

export default meta

type Story = StoryObj<TooltipControls>

export const Default: Story = {}
