import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  List4,
  type List4Integration,
} from '@tc96/blocks/application/list/list-4'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { list4Handlers } from '../../../../mocks/list-4.ts'

const IntegrationDirectory = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<List4Integration[]>('/list/integrations'),
    queryKey: ['list', 'integrations'],
  })

  return (
    <List4
      error={isError}
      integrations={data ?? []}
      onConnect={() => {}}
      onRetry={() => refetch()}
      pending={isPending}
    />
  )
}

const meta = {
  component: IntegrationDirectory,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/List/List4/Usages',
} satisfies Meta<typeof IntegrationDirectory>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Slack')).toBeVisible()
    await expect(canvas.getByText('Conectado')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Sem integrações'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as integrações',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(list4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando integrações'),
    ).toBeVisible()
  },
}
