import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List2,
  type List2Entry,
  type List2Range,
} from '@tc96/blocks/application/list/list-2'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { list2Handlers } from '../../../../mocks/list-2.ts'

const Leaderboard = () => {
  const [range, setRange] = useState<List2Range>('30d')
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<List2Entry[]>(`/list/leaderboard?range=${range}`),
    queryKey: ['list', 'leaderboard', range],
  })

  if (isPending) return <Spinner aria-label="Carregando ranking" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar o ranking</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <List2 entries={data} onRangeChange={setRange} range={range} />
}

const meta = {
  component: Leaderboard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/List/List2/Usages',
} satisfies Meta<typeof Leaderboard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Rafael Lima')).toBeVisible()
    await expect(canvas.getByText('Tiago Nunes')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum resultado no período'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar o ranking',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list2Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando ranking'),
    ).toBeVisible()
  },
}
