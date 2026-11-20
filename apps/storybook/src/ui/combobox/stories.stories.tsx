import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ComboboxControls,
  comboboxControlArgs,
  comboboxControlArgTypes,
} from './combobox-controls.ts'
import { ComboboxCanvas } from './combobox-frame.tsx'
import { ComposedCombobox } from './combobox-layouts.tsx'

const meta = {
  args: comboboxControlArgs,
  argTypes: comboboxControlArgTypes,
  decorators: [ComboboxCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'invalid', 'open', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedCombobox {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Combobox/Stories',
} satisfies Meta<ComboboxControls>

export default meta

type Story = StoryObj<ComboboxControls>

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
