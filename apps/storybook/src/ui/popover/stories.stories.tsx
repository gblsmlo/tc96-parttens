import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type PopoverControls,
  popoverControlArgs,
  popoverControlArgTypes,
} from './popover-controls.ts'
import { ComposedPopover } from './popover-layouts.tsx'

const meta = {
  args: popoverControlArgs,
  argTypes: popoverControlArgTypes,
  parameters: {
    controls: { exclude: ['tooltipStyle'] },
    layout: 'centered',
  },
  render: (args) => <ComposedPopover {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Popover/Stories',
} satisfies Meta<PopoverControls>

export default meta

type Story = StoryObj<PopoverControls>

export const Default: Story = {}

export const TooltipStyle: Story = {
  args: { tooltipStyle: true },
}
