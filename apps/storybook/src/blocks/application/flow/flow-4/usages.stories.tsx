import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Flow4,
  type Flow4Link,
  type Flow4Node,
} from '@tc96/ui/blocks/application/flow/flow-4'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { flow4Handlers } from '../../../../mocks/flow-4.ts'

interface MapData {
  links: Flow4Link[]
  nodes: Flow4Node[]
}

const GrowthPlan = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<MapData>('/flow/flow-4'),
    queryKey: ['flow', 'flow-4'],
    retry: false,
  })

  return (
    <Flow4
      error={isError}
      links={data?.links ?? []}
      nodes={data?.nodes ?? []}
      onNodeSelect={setSelectedId}
      onRetry={() => refetch()}
      pending={isPending}
      selectedId={selectedId}
    />
  )
}

const meta = {
  component: GrowthPlan,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Flow/Flow4/Usages',
} satisfies Meta<typeof GrowthPlan>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow4Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const node = await canvas.findByRole('button', {
      name: /Ativação de contas/,
    })
    await expect(node).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(node)
    await expect(node).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum nó no mapa'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar o mapa de impacto'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(flow4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando mapa de impacto'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
