import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { List6, type List6Mover } from '@tc96/ui/blocks/application/list/list-6'
import { useState } from 'react'
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
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list6Handlers.pending)
  },
}
