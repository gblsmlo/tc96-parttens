import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountScatter, formatAccount } from './charts-layouts.tsx'
import { accounts } from './fixtures/accounts'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Charts/Stories',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AccountScatter formatTooltip={formatAccount} />,
}

export const Empty: Story = {
  render: () => <AccountScatter data={[]} />,
}

export const EqualSizes: Story = {
  name: 'Equal sizes',
  render: () => (
    <AccountScatter
      data={accounts.map((account) => ({ ...account, seats: 50 }))}
      formatTooltip={formatAccount}
    />
  ),
}

export const SingleSegment: Story = {
  name: 'Single segment',
  render: () => (
    <AccountScatter
      data={accounts.filter((account) => account.segment === 'Enterprise')}
      formatTooltip={formatAccount}
    />
  ),
}
