import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Stats5, type Stats5Item } from '@tc96/blocks/application/stats/stats-5'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats5Handlers } from '../../../../mocks/stats-5.ts'

const SalesCard = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Stats5Item[]>('/stats/sales-churn'),
    queryKey: ['stats', 'sales-churn'],
  })

  if (isPending) return <Spinner aria-label="Carregando vendas" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as vendas</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Stats5 items={data} />
}

const meta = {
  component: SalesCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats5/Usages',
} satisfies Meta<typeof SalesCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats5Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Receita recorrente')).toBeVisible()
    await expect(canvas.getByText('Cancelamentos')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats5Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as vendas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats5Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando vendas'),
    ).toBeVisible()
  },
}
