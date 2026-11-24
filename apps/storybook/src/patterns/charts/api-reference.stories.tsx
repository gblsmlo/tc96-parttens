import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountScatter, formatAccount } from './charts-layouts.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Charts/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => <AccountScatter formatTooltip={formatAccount} height={320} />,
}
