import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { List5 } from '@tc96/ui/blocks/application/list/list-5'
import { fetchJson } from '../../../../mocks/api.ts'
import { list5Handlers } from '../../../../mocks/list-5.ts'
import { type ModuleRecord, toModules } from '../fixtures/list-5.ts'

const ModuleCatalog = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<ModuleRecord[]>('/list/modules'),
    queryKey: ['list', 'modules'],
  })

  return (
    <List5
      error={isError}
      modules={toModules(data ?? [])}
      onAdd={() => {}}
      onBrowseMore={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: ModuleCatalog,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List5/Usages',
} satisfies Meta<typeof ModuleCatalog>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list5Handlers.loaded)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list5Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list5Handlers.pending)
  },
}
