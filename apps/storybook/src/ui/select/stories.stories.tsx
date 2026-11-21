import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SelectControls,
  selectControlArgs,
  selectControlArgTypes,
} from './select-controls.ts'
import { SelectCanvas } from './select-frame.tsx'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  args: selectControlArgs,
  argTypes: selectControlArgTypes,
  decorators: [SelectCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'invalid', 'open', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedSelect {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Select/Stories',
} satisfies Meta<SelectControls>

export default meta

type Story = StoryObj<SelectControls>

export const Default: Story = {}

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

export const Invalid: Story = {
  args: { invalid: true },
}

export const Open: Story = {
  args: { open: true },
}
