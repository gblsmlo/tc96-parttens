import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import {
  EmptyState5,
  type EmptyState5Connector,
} from '@tc96/ui/blocks/application/empty-state/empty-state-5'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { emptyState5Handlers } from '../../../../mocks/empty-state-5.ts'

const ConnectStorage = () => {
  const [connected, setConnected] = useState<readonly string[]>([])
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<EmptyState5Connector[]>('/empty-state/connectors'),
    queryKey: ['empty-state', 'connectors'],
  })

  if (isPending) return <Spinner aria-label="Carregando serviços" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os serviços</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <EmptyState5
      connectors={data.map((connector) => ({
        ...connector,
        connected: connector.connected || connected.includes(connector.id),
      }))}
      labels={{
        description:
          'Conecte onde ficam os contratos da Padaria Estrela para importá-los de uma vez.',
      }}
      onConnect={(id) => setConnected((current) => [...current, id])}
    />
  )
}

const meta = {
  component: ConnectStorage,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Empty State/EmptyState5/Usages',
} satisfies Meta<typeof ConnectStorage>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState5Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState5Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState5Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState5Handlers.pending)
  },
}
