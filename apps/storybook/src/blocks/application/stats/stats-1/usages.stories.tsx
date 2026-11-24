import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Stats1, type Stats1Stat } from '@tc96/blocks/application/stats/stats-1'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats1Handlers } from '../../../../mocks/stats-1.ts'

const OverviewStats = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Stats1Stat[]>('/stats/overview'),
    queryKey: ['stats', 'overview'],
  })

  if (isPending) return <Spinner aria-label="Carregando indicadores" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os indicadores</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <Stats1 onStatAction={fn()} stats={data} />
}

const meta = {
  component: OverviewStats,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats1/Usages',
} satisfies Meta<typeof OverviewStats>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('region', { name: 'Receita do mês' }),
    ).toBeVisible()
    await expect(canvas.getByText('Taxa de conversão')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os indicadores',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando indicadores'),
    ).toBeVisible()
  },
}
