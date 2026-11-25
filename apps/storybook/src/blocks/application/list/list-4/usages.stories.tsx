import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List4,
  type List4Integration,
} from '@tc96/ui/blocks/application/list/list-4'
import { fetchJson } from '../../../../mocks/api.ts'
import { list4Handlers } from '../../../../mocks/list-4.ts'

const IntegrationDirectory = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<List4Integration[]>('/list/integrations'),
    queryKey: ['list', 'integrations'],
  })

  return (
    <List4
      error={isError}
      integrations={data ?? []}
      onConnect={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: IntegrationDirectory,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List4/Usages',
} satisfies Meta<typeof IntegrationDirectory>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.pending)
  },
}
