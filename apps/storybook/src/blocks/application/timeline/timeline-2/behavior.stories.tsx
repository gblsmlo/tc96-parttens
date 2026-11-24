import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline2 } from '@tc96/ui/blocks/application/timeline/timeline-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import { releases } from '../fixtures/timeline-2.ts'
import {
  type Timeline2Controls,
  timeline2ControlArgs,
} from './timeline-2-controls.ts'
import { ComposedTimeline2 } from './timeline-2-layouts.tsx'

const meta = {
  args: { ...timeline2ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline2/Behavior',
} satisfies Meta<Timeline2Controls & { onRetry: () => void }>

export default meta

type Story = StoryObj<typeof meta>

export const EachReleaseShowsVersionAndDate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Versão 2.4.0')).toBeVisible()
    const release = canvasElement.querySelector('[data-release="v2-4-0"]')
    await expect(release?.querySelector('time')).toHaveAttribute(
      'datetime',
      '2026-11-20',
    )
    await expect(release?.querySelector('time')).toHaveTextContent(/20 de nov/)
  },
}

export const EntriesShowTypeBadgeAndItems: Story = {
  play: async ({ canvasElement }) => {
    const entry = canvasElement.querySelector(
      '[data-release="v2-4-0"] [data-type="new"]',
    )
    await expect(entry?.querySelector('[data-slot="badge"]')).toHaveTextContent(
      'Novo',
    )
    await expect(entry?.querySelectorAll('li')).toHaveLength(2)
    await expect(entry).toHaveTextContent('Painel de metas por equipe')
  },
}

export const TypeBadgesUseTheirOwnLabelAndTone: Story = {
  play: async ({ canvasElement }) => {
    const badge = (type: string) =>
      canvasElement.querySelector(`[data-type="${type}"] [data-slot="badge"]`)
    await expect(badge('new')).toHaveTextContent('Novo')
    await expect(badge('new')).toHaveClass('text-success-foreground')
    await expect(badge('improvement')).toHaveTextContent('Melhoria')
    await expect(badge('improvement')).toHaveClass('text-info-foreground')
    await expect(badge('fix')).toHaveTextContent('Correção')
    await expect(badge('fix')).toHaveClass('text-warning-foreground')
  },
}

export const LastReleaseHasNoConnector: Story = {
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="timeline-item"]')
    await expect(items).toHaveLength(releases.length)
    await expect(
      items[items.length - 1]?.querySelector(
        '[data-slot="timeline-connector"]',
      ),
    ).toBeNull()
  },
}

export const EmptyReleasesShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma versão publicada')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando histórico de versões'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Histórico de versões')).toBeVisible()
    await expect(canvas.queryByText('Versão 2.4.0')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Timeline2 error releases={releases} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Timeline2 error pending releases={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando histórico de versões'),
    ).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.queryByText('Nenhuma versão publicada')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Timeline2 error releases={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma versão publicada')).toBeNull()
  },
}

export const LocaleFormatsTheDateRail: Story = {
  args: { locale: 'en-US' },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-release="v2-4-0"] time'),
    ).toHaveTextContent(/Nov 20/)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Timeline2
      labels={{ title: 'Novidades', types: { new: 'Lançamento' } }}
      releases={releases}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Novidades' })).toBeVisible()
    await expect(canvas.getAllByText('Lançamento').length).toBeGreaterThan(0)
    await expect(canvas.getAllByText('Melhoria').length).toBeGreaterThan(0)
  },
}
