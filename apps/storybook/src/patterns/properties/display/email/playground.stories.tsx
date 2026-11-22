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
  render: (args) => <ComposedEmail {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Playground',
} satisfies Meta<EmailControls>

export default meta

type Story = StoryObj<EmailControls>

export const Playground: Story = {}
