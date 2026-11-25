import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneCanvas } from './phone-canvas.tsx'
import {
  type PhoneControls,
  phoneControlArgs,
  phoneControlArgTypes,
} from './phone-controls.ts'
import { ComposedPhone } from './phone-layouts.tsx'

const meta = {
  args: phoneControlArgs,
  argTypes: phoneControlArgTypes,
  decorators: [PhoneCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'readOnly', 'value'] },
  },
  render: (args) => <ComposedPhone {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Variants',
} satisfies Meta<PhoneControls>

export default meta

type Story = StoryObj<PhoneControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: [] },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
