import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from '@tc96/ui/spinner'

const meta = {
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Spinner/API Reference',
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => <Spinner {...args} />,
}
