import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import type { Navbar3Notification } from '@tc96/blocks/application/navbar/navbar-3'
import { Navbar3 } from '@tc96/blocks/application/navbar/navbar-3'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { navbar3Handlers } from '../../../../mocks/navbar-3.ts'
import { routes, user, userActions } from '../fixtures/navbar-3.ts'

const OrdersHome = () => {
  const [page, setPage] = useState('/painel')
  const { data = [] } = useQuery({
    queryFn: () => fetchJson<Navbar3Notification[]>('/navbar/notifications'),
    queryKey: ['navbar', 'notifications'],
  })

  return (
    <div className="flex min-h-96 flex-col">
      <Navbar3
        notifications={data}
        onNavigate={setPage}
        routes={routes}
        user={user}
        userActions={userActions}
      />
      <main className="p-6">
        <Text>{`Página aberta: ${page}`}</Text>
      </main>
    </div>
  )
}

const meta = {
  component: OrdersHome,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Navbar/Navbar3/Usages',
} satisfies Meta<typeof OrdersHome>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(navbar3Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('button', { name: 'Notificações, 2 não lidas' }),
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Buscar' }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Pedidos' }),
    )
    await expect(canvas.getByText('Página aberta: /pedidos')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(navbar3Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Notificações' }),
    )
    await waitFor(() =>
      expect(
        screen.getByText('Nenhuma notificação por enquanto.'),
      ).toBeVisible(),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(
        screen.queryByText('Nenhuma notificação por enquanto.'),
      ).toBeNull(),
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(navbar3Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByRole('button', {
        name: 'Notificações',
      }),
    ).toBeVisible()
  },
}
