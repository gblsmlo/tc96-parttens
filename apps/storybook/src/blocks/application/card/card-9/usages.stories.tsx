import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card9,
  type Card9Delivery,
} from '@tc96/ui/blocks/application/card/card-9'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card9Handlers } from '../../../../mocks/card-9.ts'
import { deliveryActions } from '../fixtures/card-9.ts'

const OrderDelivery = ({
  onActionSelect,
  orderId,
}: {
  onActionSelect: (actionId: string) => void
  orderId: string
}) => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card9Delivery>(`/orders/${orderId}/delivery`),
    queryKey: ['orders', orderId, 'delivery'],
  })

  return (
    <Card9
      actions={deliveryActions}
      className="max-w-md"
      delivery={data}
      error={isError}
      onActionSelect={onActionSelect}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  args: { onActionSelect: fn(), orderId: 'br-54321' },
  component: OrderDelivery,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card9/Usages',
} satisfies Meta<typeof OrderDelivery>

export default meta

type Story = StoryObj<typeof meta>

export const CustomerOrder: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card9Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card9Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card9Handlers.pending)
  },
}
