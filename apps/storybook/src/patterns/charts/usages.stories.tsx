import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountHealth } from './account-health'

const meta = {
  component: AccountHealth,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Charts/Usages',
} satisfies Meta<typeof AccountHealth>

export default meta

type Story = StoryObj<typeof meta>

export const AccountHealthScatter: Story = {}
