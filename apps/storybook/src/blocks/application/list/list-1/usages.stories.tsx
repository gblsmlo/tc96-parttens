import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List1,
  type List1Metric,
} from '@tc96/ui/blocks/application/list/list-1'
import { fetchJson } from '../../../../mocks/api.ts'
import { list1Handlers } from '../../../../mocks/list-1.ts'

const MetricList = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<List1Metric[]>('/list/metrics'),
    queryKey: ['list', 'metrics'],
  })

  return (
    <List1
      error={isError}
      metrics={data ?? []}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: MetricList,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List1/Usages',
} satisfies Meta<typeof MetricList>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list1Handlers.pending)
  },
}
