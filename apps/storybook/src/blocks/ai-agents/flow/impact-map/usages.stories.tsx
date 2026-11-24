import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  ImpactMap,
  type ImpactMapLink,
  type ImpactMapNode,
} from '@tc96/blocks/ai-agents/flow/impact-map'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { impactMapHandlers } from '../../../../mocks/impact-map.ts'

interface MapData {
  links: ImpactMapLink[]
  nodes: ImpactMapNode[]
}

const GrowthPlan = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<MapData>('/flow/impact-map'),
    queryKey: ['flow', 'impact-map'],
    retry: false,
  })

  return (
    <ImpactMap
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
  tags: ['!autodocs'],
  title: 'Blocks/AI & Agents/Flow/ImpactMap/Usages',
} satisfies Meta<typeof GrowthPlan>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(impactMapHandlers.loaded)
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
    msw.use(impactMapHandlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum nó no mapa'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(impactMapHandlers.error)
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
    msw.use(impactMapHandlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando mapa de impacto'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}
