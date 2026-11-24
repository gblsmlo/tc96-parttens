import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card9, type Card9Delivery } from '@tc96/blocks/application/card/card-9'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('#BR-54321-SP')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações da entrega' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Falar com o suporte' }),
    )
    await expect(args.onActionSelect).toHaveBeenCalledWith('support')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card9Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a entrega',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card9Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando entrega'),
    ).toBeVisible()
  },
}
