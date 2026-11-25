import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Card2,
  type Card2Integration,
} from '@tc96/ui/blocks/application/card/card-2'
import { fetchJson } from '../../../../mocks/api.ts'
import { card2Handlers } from '../../../../mocks/card-2.ts'

const IntegrationCatalog = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Card2Integration[]>('/card/integrations'),
    queryKey: ['card', 'integrations'],
  })

  return (
    <Card2
      error={isError}
      integrations={data ?? []}
      onConnect={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: IntegrationCatalog,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card2/Usages',
} satisfies Meta<typeof IntegrationCatalog>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card2Handlers.pending)
  },
}
