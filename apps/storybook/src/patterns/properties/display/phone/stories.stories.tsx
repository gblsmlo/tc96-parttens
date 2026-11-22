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
    controls: {
      exclude: ['disabled', 'display', 'readOnly', 'value'],
    },
  },
  render: (args) => <ComposedPhone {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Stories',
} satisfies Meta<PhoneControls>

export default meta

type Story = StoryObj<PhoneControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: [] },
}

export const TriggerDisplay: Story = {
  args: { display: 'trigger' },
  name: 'Display trigger',
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
