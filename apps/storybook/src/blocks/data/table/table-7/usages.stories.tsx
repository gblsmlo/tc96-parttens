import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table7, type Table7Rule } from '@tc96/ui/blocks/data/table/table-7'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { table7Handlers } from '../../../../mocks/table-7.ts'
import { moveRule, rowActions, sameOrder } from '../fixtures/table-7.ts'

const queryKey = ['data', 'table', 'routing-rules']

const RoutingRules = () => {
  const queryClient = useQueryClient()
  const [order, setOrder] = useState<string[] | null>(null)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Table7Rule[]>('/data/table/routing-rules'),
    queryKey,
  })
  const saved = data ?? []
  const rules = order
    ? order.flatMap((id) => saved.filter((rule) => rule.id === id))
    : saved

  return (
    <Table7
      error={isError}
      onEnabledChange={(id, enabled) =>
        queryClient.setQueryData<Table7Rule[]>(queryKey, (current) =>
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
  title: 'Blocks/Data/Table/Table7/Usages',
} satisfies Meta<typeof RoutingRules>

export default meta

type Story = StoryObj<typeof meta>

const ruleNames = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll(
      '[data-slot="data-table"] tbody [data-slot="table-row"] [data-slot="table-cell"]:nth-child(3) .font-medium',
    ),
  ).map((cell) => cell.textContent)

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table7Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const handle = await canvas.findByRole('button', {
      name: 'Arrastar para reordenar a regra Pedidos de reembolso',
    })
    await waitFor(() => expect(handle).toHaveAttribute('aria-pressed', 'false'))
    handle.focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    await userEvent.keyboard(' ')
    await waitFor(() =>
      expect(ruleNames(canvasElement)[4]).toBe('Pedidos de reembolso'),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Restaurar ordem' }),
    )
    await waitFor(() =>
      expect(ruleNames(canvasElement)[6]).toBe('Pedidos de reembolso'),
    )
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table7Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma regra de roteamento.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table7Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as regras',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(table7Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando regras'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Regras de roteamento' }),
    ).toBeVisible()
  },
}
