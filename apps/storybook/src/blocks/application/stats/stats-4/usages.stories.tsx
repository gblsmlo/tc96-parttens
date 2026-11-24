import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Stats4,
  type Stats4Range,
} from '@tc96/blocks/application/stats/stats-4'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { stats4Handlers } from '../../../../mocks/stats-4.ts'
import type { LeadsOverview } from '../fixtures/stats-4.ts'

const LeadsCard = () => {
  const [range, setRange] = useState<Stats4Range>('30d')
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<LeadsOverview>(`/stats/leads?range=${range}`),
    queryKey: ['stats', 'leads', range],
  })

  if (isPending) return <Spinner aria-label="Carregando leads" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os leads</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Stats4
      goal={data.goal}
      onRangeChange={setRange}
      range={range}
      sources={data.sources}
      total={data.total}
    />
  )
}

const meta = {
  component: LeadsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats4/Usages',
} satisfies Meta<typeof LeadsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Meta de 1.500 leads')).toBeVisible()
    await expect(canvas.getByText('Busca orgânica')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os leads',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(stats4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando leads'),
    ).toBeVisible()
  },
}
