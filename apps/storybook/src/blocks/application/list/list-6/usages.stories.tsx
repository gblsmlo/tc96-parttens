import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { List6, type List6Mover } from '@tc96/ui/blocks/application/list/list-6'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { list6Handlers } from '../../../../mocks/list-6.ts'
import { filterMovers } from './list-6-layouts.tsx'

const TopMovers = () => {
  const [query, setQuery] = useState('')
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<List6Mover[]>('/list/movers'),
    queryKey: ['list', 'movers'],
  })

  return (
    <List6
      error={isError}
      movers={filterMovers(data ?? [], query)}
      onQueryChange={setQuery}
      onRetry={() => refetch()}
      pending={isPending}
      query={query}
    />
  )
}

const meta = {
  component: TopMovers,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List6/Usages',
} satisfies Meta<typeof TopMovers>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Aurora Energia')).toBeVisible()
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Buscar ativos' }),
      'cobalto',
    )
    await expect(canvas.getAllByRole('row')).toHaveLength(2)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Sem ativos'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os ativos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando ativos'),
    ).toBeVisible()
  },
}
