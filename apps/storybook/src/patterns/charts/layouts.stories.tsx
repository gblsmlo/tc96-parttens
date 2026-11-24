import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AccountScatter,
  AccountScatterWithDetail,
  formatAccount,
} from './charts-layouts.tsx'

const meta = {
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Charts/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const DefaultTooltip: Story = {
  render: () => <AccountScatter />,
}

export const FormattedTooltip: Story = {
  render: () => <AccountScatter formatTooltip={formatAccount} />,
}

export const WithDetailPanel: Story = {
  render: () => <AccountScatterWithDetail />,
}
