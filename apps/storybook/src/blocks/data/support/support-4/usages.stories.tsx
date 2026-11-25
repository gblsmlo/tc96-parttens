import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Support4,
  type Support4Rule,
} from '@tc96/ui/blocks/data/support/support-4'
import { useState } from 'react'
import { fetchJson } from '../../../../mocks/api.ts'
import { support4Handlers } from '../../../../mocks/support-4.ts'
import { moveRule, rowActions, sameOrder } from '../fixtures/support-4.ts'

const queryKey = ['data', 'table', 'routing-rules']

const RoutingRules = () => {
  const queryClient = useQueryClient()
  const [order, setOrder] = useState<string[] | null>(null)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Support4Rule[]>('/data/table/routing-rules'),
    queryKey,
  })
  const saved = data ?? []
  const rules = order
    ? order.flatMap((id) => saved.filter((rule) => rule.id === id))
    : saved

  return (
    <Support4
      error={isError}
      onEnabledChange={(id, enabled) =>
        queryClient.setQueryData<Support4Rule[]>(queryKey, (current) =>
          current?.map((rule) =>
            rule.id === id ? { ...rule, enabled } : rule,
          ),
        )
      }
      onResetOrder={() => setOrder(null)}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onRuleMove={(move) =>
        setOrder(moveRule(rules, move).map((rule) => rule.id))
      }
      orderChanged={!sameOrder(rules, saved)}
      pending={isPending}
      rowActions={rowActions}
      rules={rules}
    />
  )
}

const meta = {
  component: RoutingRules,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Support/Support4/Usages',
} satisfies Meta<typeof RoutingRules>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support4Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support4Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support4Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(support4Handlers.pending)
  },
}
