import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@tc96/ui/input'
import { InputCanvas } from './input-frame.tsx'

const meta = {
  component: Input,
  decorators: [InputCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Input/API Reference',
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => <Input aria-label="Input" placeholder="Input" {...args} />,
}
