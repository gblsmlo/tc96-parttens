import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToggleGroupControls,
  toggleGroupControlArgs,
  toggleGroupControlArgTypes,
} from './toggle-group-controls.ts'
import { ComposedToggleGroup } from './toggle-group-layouts.tsx'

const meta = {
  args: toggleGroupControlArgs,
  argTypes: toggleGroupControlArgTypes,
  parameters: {
    controls: {
      exclude: ['disabled', 'disabledItem', 'orientation', 'size', 'variant'],
    },
    layout: 'centered',
  },
  render: (args) => <ComposedToggleGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ToggleGroup/Stories',
} satisfies Meta<ToggleGroupControls>

export default meta

type Story = StoryObj<ToggleGroupControls>

export const Default: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledItem: Story = {
  args: { disabledItem: true },
  name: 'Disabled item',
}
