import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import type { Navbar3Notification } from '@tc96/ui/blocks/application/navbar/navbar-3'
import { Navbar3 } from '@tc96/ui/blocks/application/navbar/navbar-3'
import { Text } from '@tc96/ui/text'
import { useState } from 'react'
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
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(navbar3Handlers.empty)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(navbar3Handlers.pending)
  },
}
