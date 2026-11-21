import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from '@tc96/ui/textarea'
import { TextareaCanvas } from './textarea-frame.tsx'

const meta = {
  component: Textarea,
  decorators: [TextareaCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Textarea/API Reference',
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Textarea aria-label="Textarea" placeholder="Textarea" {...args} />
  ),
}
