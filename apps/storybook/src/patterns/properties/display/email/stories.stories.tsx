import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailCanvas } from './email-canvas.tsx'
import {
  type EmailControls,
  emailControlArgs,
  emailControlArgTypes,
} from './email-controls.ts'
import { ComposedEmail } from './email-layouts.tsx'

const meta = {
  args: emailControlArgs,
  argTypes: emailControlArgTypes,
  decorators: [EmailCanvas],
  parameters: {
    controls: {
      exclude: ['disabled', 'display', 'readOnly', 'value'],
    },
  },
  render: (args) => <ComposedEmail {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Stories',
} satisfies Meta<EmailControls>

export default meta

type Story = StoryObj<EmailControls>

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
