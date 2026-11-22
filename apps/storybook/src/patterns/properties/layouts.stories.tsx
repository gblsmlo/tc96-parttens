import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlainPropertyColumn } from './properties-layouts'

const meta = {
  decorators: [
    (Story) => (
      <div className="min-h-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const PlainColumn: Story = {
  render: () => <PlainPropertyColumn />,
}
