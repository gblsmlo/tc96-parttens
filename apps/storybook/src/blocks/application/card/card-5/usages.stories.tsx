import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Card5 } from '@tc96/ui/blocks/application/card/card-5'
import { fn } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { card5Handlers } from '../../../../mocks/card-5.ts'
import { type ShortcutRecord, toShortcuts } from '../fixtures/card-5.ts'

const onSelect = fn()

const ShortcutsCard = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<ShortcutRecord[]>('/cards/shortcuts'),
    queryKey: ['cards', 'shortcuts'],
  })

  return (
    <Card5
      error={isError}
      onRetry={() => refetch()}
      onSelect={onSelect}
      pending={isPending}
      shortcuts={toShortcuts(data ?? [])}
    />
  )
}

const meta = {
  component: ShortcutsCard,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Card/Card5/Usages',
} satisfies Meta<typeof ShortcutsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    onSelect.mockClear()
    msw.use(card5Handlers.loaded)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card5Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card5Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(card5Handlers.pending)
  },
}
