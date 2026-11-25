import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { EmptyState2 } from '@tc96/ui/blocks/application/empty-state/empty-state-2'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { emptyState2Handlers } from '../../../../mocks/empty-state-2.ts'

const InvoiceSearch = () => {
  const [query, setQuery] = useState('fatura atrasada')
  const { data, error, isPending } = useQuery({
    queryFn: () =>
      fetchJson<string[]>(
        `/empty-state/suggestions?query=${encodeURIComponent(query)}`,
      ),
    queryKey: ['empty-state', 'suggestions', query],
  })

  if (!query) return <p className="text-sm">Busca limpa.</p>
  if (isPending) return <Spinner aria-label="Carregando sugestões" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as sugestões</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <EmptyState2
      onClear={() => setQuery('')}
      onSuggestion={setQuery}
      query={query}
      suggestions={data}
    />
  )
}

const meta = {
  component: InvoiceSearch,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Empty State/EmptyState2/Usages',
} satisfies Meta<typeof InvoiceSearch>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(emptyState2Handlers.pending)
  },
}
