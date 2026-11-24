import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Stats4,
  type Stats4Props,
} from '@tc96/ui/blocks/application/stats/stats-4'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { leadsOverview } from '../fixtures/stats-4.ts'
import { type Stats4Controls, stats4ControlArgs } from './stats-4-controls.ts'
import { ComposedStats4 } from './stats-4-layouts.tsx'

const loaded: Stats4Props = {
  goal: leadsOverview.goal,
  range: '30d',
  sources: leadsOverview.sources,
  total: leadsOverview.total,
}

const retry = fn()

const meta = {
  args: { ...stats4ControlArgs, onRangeChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedStats4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Stats/Stats4/Behavior',
} satisfies Meta<Stats4Controls & { onRangeChange: (range: string) => void }>

export default meta

type Story = StoryObj<typeof meta>

export const TotalAndGoalProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Meta de 1.500 leads')).toBeVisible()
    await expect(canvas.getByText('1.200')).toBeVisible()
    await expect(canvas.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '1.200 de 1.500 leads, 80% da meta',
    )
  },
}

export const ProgressStopsAtTheGoal: Story = {
  args: { total: 2000 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('progressbar'),
    ).toHaveAttribute('aria-valuetext', '2.000 de 1.500 leads, 100% da meta')
  },
}

export const SourcesBarSplitsByShare: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole('img', {
      name: 'Distribuição dos leads por origem',
    })
    await expect(bar.children).toHaveLength(4)
    await expect(
      (bar.querySelector('[data-source="organic"]') as HTMLElement).style.width,
    ).toBe('40%')
    await expect(canvas.getByText('Busca orgânica')).toBeVisible()
    await expect(canvas.getByText('480 · 40%')).toBeVisible()
  },
}

export const EmptySourcesRenderNoSegments: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole('img', {
      name: 'Distribuição dos leads por origem',
    })
    await expect(bar.children).toHaveLength(0)
    await expect(canvas.queryByText('Busca orgânica')).toBeNull()
  },
}

export const RangeSelectCallsOnRangeChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: 'Período' })
    await expect(select).toHaveTextContent('30 dias')
    await userEvent.click(select)
    await userEvent.click(
      await screen.findByRole('option', { name: '90 dias' }),
    )
    await waitFor(() => expect(args.onRangeChange).toHaveBeenCalledWith('90d'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(select).toHaveTextContent('90 dias')
    await expect(canvas.getByText('Leads nos últimos 90 dias')).toBeVisible()
  },
}

export const RangeIsControlled: Story = {
  render: (args) => (
    <Stats4
      goal={leadsOverview.goal}
      onRangeChange={args.onRangeChange}
      range="7d"
      sources={leadsOverview.sources}
      total={leadsOverview.total}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', {
      name: 'Período',
    })
    await userEvent.click(select)
    await userEvent.click(
      await screen.findByRole('option', { name: '30 dias' }),
    )
    await waitFor(() => expect(args.onRangeChange).toHaveBeenCalledWith('30d'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await expect(select).toHaveTextContent('7 dias')
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Stats4
      goal={leadsOverview.goal}
      labels={{
        goal: (goal) => `Objetivo: ${goal}`,
        range: 'Janela',
        ranges: { '30d': '30 d', '7d': '7 d', '90d': '90 d' },
        sources: 'Canais',
        title: 'Captação',
        total: (range) => `Novos leads em ${range}`,
      }}
      range="30d"
      sources={leadsOverview.sources}
      total={leadsOverview.total}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Captação')).toBeVisible()
    await expect(canvas.getByText('Objetivo: 1.500')).toBeVisible()
    await expect(canvas.getByText('Novos leads em 30 d')).toBeVisible()
    await expect(canvas.getByText('Canais')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Janela' }),
    ).toHaveTextContent('30 d')
    await expect(canvas.queryByText('Visão geral de leads')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: () => <Stats4 {...loaded} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando leads')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('region', { name: 'Visão geral de leads' }),
    ).toBeVisible()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: () => <Stats4 {...loaded} error onRetry={retry} />,
  play: async ({ canvasElement }) => {
    retry.mockClear()
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os leads'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retry).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: () => <Stats4 {...loaded} error />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: () => <Stats4 {...loaded} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando leads')).toBeVisible()
    await expect(
      canvas.queryByText('Não foi possível carregar os leads'),
    ).toBeNull()
  },
}
