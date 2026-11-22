import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailCanvas } from './email-canvas.tsx'
import { emailControlArgs } from './email-controls.ts'
import { ComposedEmail } from './email-layouts.tsx'

const meta = {
  decorators: [EmailCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutAddTrigger: Story = {
  render: () => <ComposedEmail {...emailControlArgs} addTrigger={false} />,
}
