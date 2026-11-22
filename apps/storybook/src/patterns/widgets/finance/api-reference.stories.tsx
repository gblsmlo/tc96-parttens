import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AssetList,
  AssetListItem,
  MarketShareWidget,
  TransactionsWidget,
} from '@tc96/parttens'
import { Slot } from '../../../test-utils/anatomy-slot.tsx'
import { marketSegments } from './finance-data.tsx'

const meta = {
  component: MarketShareWidget,
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Widgets/Finance/API Reference',
} satisfies Meta<typeof MarketShareWidget>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <MarketShareWidget
      endLabel={<Slot name="endLabel" />}
      segments={marketSegments.month}
      startLabel={<Slot name="startLabel" />}
      title="MarketShareWidget"
    >
      <AssetList aria-label="AssetList">
        <AssetListItem
          icon={<Slot name="icon" />}
          meta={<Slot name="meta" />}
          name={<Slot name="name" />}
          value={<Slot name="value" />}
        />
      </AssetList>
    </MarketShareWidget>
  ),
}

export const TransactionsAnatomy: Story = {
  render: () => (
    <TransactionsWidget
      action={<Slot name="action" />}
      title="TransactionsWidget"
      transactions={[
        {
          amount: -12.5,
          icon: <Slot name="icon" />,
          id: 'one',
          meta: <Slot name="meta" />,
          name: <Slot name="name" />,
          status: <Slot name="status" />,
        },
      ]}
    />
  ),
}
