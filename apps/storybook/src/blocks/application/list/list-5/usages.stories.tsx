import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { List5 } from '@tc96/blocks/application/list/list-5'
import { expect, within } from 'storybook/test'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Relatórios')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Ver mais' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list5Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os módulos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list5Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando módulos'),
    ).toBeVisible()
  },
}
