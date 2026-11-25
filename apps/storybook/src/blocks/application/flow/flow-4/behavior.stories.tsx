import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow4 } from '@tc96/ui/blocks/application/flow/flow-4'
import { expect, fn, userEvent, within } from 'storybook/test'
import { links, nodes } from '../fixtures/flow-4.ts'
import { type Flow4Controls, flow4ControlArgs } from './flow-4-controls.ts'
import { ComposedFlow4 } from './flow-4-layouts.tsx'

type BehaviorArgs = Flow4Controls & {
  onNodeSelect: (id: string) => void
  onRetry: () => void
}

const meta = {
  args: { ...flow4ControlArgs, onNodeSelect: fn(), onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFlow4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow4/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const nodeOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(`[data-node="${id}"]`)

export const EachNodeShowsTitleKindAndOwnerInitials: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem')).toHaveLength(nodes.length)
    const node = nodeOf(canvasElement, 'onboarding')
    await expect(node).toHaveTextContent('Onboarding guiado')
    await expect(node).toHaveTextContent('Iniciativa')
    await expect(node).toHaveTextContent('JA')
    await expect(nodeOf(canvasElement, 'mrr')).toHaveTextContent('North star')
  },
}

export const ProgressBarReadsTheNodeValue: Story = {
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', {
      name: 'Progresso de Onboarding guiado: 80%',
    })
    await expect(bar).toHaveAttribute('aria-valuenow', '80')
  },
}

export const ProgressOutOfRangeIsClamped: Story = {
  render: () => (
    <Flow4
      links={[]}
      nodes={[
        { id: 'over', kind: 'initiative', progress: 140, title: 'Acima' },
        { id: 'under', kind: 'initiative', progress: -5, title: 'Abaixo' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('progressbar', { name: 'Progresso de Acima: 100%' }),
    ).toHaveAttribute('aria-valuenow', '100')
    await expect(
      canvas.getByRole('progressbar', { name: 'Progresso de Abaixo: 0%' }),
    ).toHaveAttribute('aria-valuenow', '0')
  },
}

export const TreeGrowsDownFromTheNorthStar: Story = {
  play: async ({ canvasElement }) => {
    const top = (id: string) =>
      nodeOf(canvasElement, id)?.getBoundingClientRect().top ?? 0
    await expect(top('mrr')).toBeLessThan(top('activation'))
    await expect(top('activation')).toBeLessThan(top('onboarding'))
    await expect(top('retention')).toBeLessThan(top('churn'))
  },
}

export const EachLinkDrawsOneLine: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="flow-4-edges"] path'),
    ).toHaveLength(links.length)
  },
}

export const ClickCallsOnNodeSelectWithTheId: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /Retenção em 90 dias/,
      }),
    )
    await expect(args.onNodeSelect).toHaveBeenCalledTimes(1)
    await expect(args.onNodeSelect).toHaveBeenCalledWith('retention')
  },
}

export const SelectedNodeIsHighlighted: Story = {
  play: async ({ canvasElement }) => {
    const selected = nodeOf(canvasElement, 'onboarding')
    await expect(selected).toHaveAttribute('aria-pressed', 'true')
    await expect(selected).toHaveAttribute('data-selected')
    await expect(selected).toHaveClass('ring-primary')
    await expect(
      canvasElement.querySelectorAll('[data-selected]'),
    ).toHaveLength(1)
  },
}

export const SelectionIsControlled: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: /Retenção em 90 dias/,
      }),
    )
    await expect(nodeOf(canvasElement, 'onboarding')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(nodeOf(canvasElement, 'retention')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const NoSelectedIdHighlightsNothing: Story = {
  args: { selectedId: 'none' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-selected]'),
    ).toHaveLength(0)
  },
}

export const OwnerAvatarShowsOnlyWhenGiven: Story = {
  args: { owners: false },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="avatar"]'),
    ).toHaveLength(0)
  },
}

export const ValueBadgeShowsOnlyWhenGiven: Story = {
  play: async ({ canvasElement }) => {
    await expect(nodeOf(canvasElement, 'mrr')).toHaveTextContent('R$ 1,2 mi')
    await expect(
      nodeOf(canvasElement, 'onboarding')?.querySelector('[data-slot="badge"]'),
    ).toBeNull()
  },
}

export const EmptyNodesShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhum nó no mapa')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando mapa de impacto'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByText('Mapa de impacto de crescimento'),
    ).toBeVisible()
    await expect(canvas.queryByText('Onboarding guiado')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar o mapa de impacto'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Flow4 error links={links} nodes={nodes} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Flow4 error links={[]} nodes={[]} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando mapa de impacto'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.queryByText('Nenhum nó no mapa')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Flow4 error links={[]} nodes={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhum nó no mapa')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Flow4
      labels={{
        kinds: { initiative: 'Ação', metric: 'KPI', 'north-star': 'Meta' },
        map: 'Árvore de metas',
        title: 'Plano de 2027',
      }}
      links={links}
      nodes={nodes}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Plano de 2027')).toBeVisible()
    await expect(
      canvas.getByRole('list', { name: 'Árvore de metas' }),
    ).toBeVisible()
    await expect(nodeOf(canvasElement, 'mrr')).toHaveTextContent('Meta')
  },
}
