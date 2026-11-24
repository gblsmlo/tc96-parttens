import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline4 } from '@tc96/ui/blocks/application/timeline/timeline-4'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { activityEntries } from '../fixtures/timeline-4.ts'
import { timeline4ControlArgs } from './timeline-4-controls.ts'
import {
  ComposedTimeline4,
  type ComposedTimeline4Props,
} from './timeline-4-layouts.tsx'

const meta = {
  args: {
    ...timeline4ControlArgs,
    onOpenChange: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline4/Behavior',
} satisfies Meta<ComposedTimeline4Props>

export default meta

type Story = StoryObj<typeof meta>

export const SheetStartsClosed: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Ver atividades' }),
    ).toBeVisible()
    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}

export const TriggerOpensSheetAndCallsOnOpenChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Ver atividades' }),
    )
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(dialog).toBeInTheDocument()
    await expect(args.onOpenChange).toHaveBeenCalledWith(true)
  },
}

export const EscapeClosesSheetAndCallsOnOpenChange: Story = {
  args: { open: true },
  play: async ({ args }) => {
    await screen.findByRole('dialog', { name: 'Atividades' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

export const OpenIsControlled: Story = {
  render: (args) => (
    <Timeline4
      entries={activityEntries}
      onOpenChange={(next) => args.onOpenChange?.(next)}
      open
    />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog', { name: 'Atividades' })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(false))
    await expect(screen.getByRole('dialog')).toBeInTheDocument()
  },
}

export const EachEntryShowsMarkerTitleAndTime: Story = {
  args: { open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    const rows = within(dialog).getAllByRole('listitem')
    await expect(rows).toHaveLength(4)
    await expect(within(rows[0]).getByText('MS')).toBeInTheDocument()
    await expect(
      within(rows[0]).getByText('Marina Souza aprovou o orçamento'),
    ).toBeInTheDocument()
    await expect(within(rows[0]).getByText('Hoje, 10:42')).toBeInTheDocument()
  },
}

export const FeedIsANamedList: Story = {
  args: { open: true },
  play: async () => {
    await expect(
      await screen.findByRole('list', { name: 'Linha do tempo de atividades' }),
    ).toBeInTheDocument()
  },
}

export const BadgeRendersOnlyWhenEntryHasOne: Story = {
  args: { open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    const rows = within(dialog).getAllByRole('listitem')
    await expect(within(rows[0]).getByText('Aprovado')).toBeInTheDocument()
    await expect(rows[1].querySelector('[data-slot="badge"]')).toBeNull()
  },
}

export const FeedIsScrollable: Story = {
  args: { open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      dialog.querySelector('[data-slot="scroll-area-viewport"]'),
    ).not.toBeNull()
  },
}

export const EmptyEntriesShowEmptyStateInsideSheet: Story = {
  args: { empty: true, open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByText('Nenhuma atividade'),
    ).toBeInTheDocument()
    await expect(within(dialog).queryByRole('list')).toBeNull()
  },
}

export const PendingShowsSkeletonInsideSheet: Story = {
  args: { open: true, pending: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByLabelText('Carregando atividades'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(within(dialog).queryByRole('list')).toBeNull()
  },
}

export const ErrorShowsSurfaceWithRetry: Story = {
  args: { error: true, open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByText('Não foi possível carregar as atividades'),
    ).toBeInTheDocument()
    await expect(within(dialog).queryByRole('list')).toBeNull()
  },
}

export const RetryCallsOnRetry: Story = {
  args: { error: true, open: true },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesButton: Story = {
  render: () => <Timeline4 entries={[]} error onOpenChange={fn()} open />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByText('Não foi possível carregar as atividades'),
    ).toBeInTheDocument()
    await expect(
      within(dialog).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  args: { empty: true, error: true, open: true, pending: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByLabelText('Carregando atividades'),
    ).toBeInTheDocument()
    await expect(
      within(dialog).queryByText('Não foi possível carregar as atividades'),
    ).toBeNull()
    await expect(within(dialog).queryByText('Nenhuma atividade')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  args: { empty: true, error: true, open: true },
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(
      within(dialog).getByText('Não foi possível carregar as atividades'),
    ).toBeInTheDocument()
    await expect(within(dialog).queryByText('Nenhuma atividade')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Timeline4
      entries={activityEntries}
      labels={{
        description: 'Tudo o que mudou.',
        feed: 'Feed',
        title: 'Histórico',
        trigger: 'Abrir histórico',
      }}
      onOpenChange={fn()}
      open
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Abrir histórico'),
    ).toBeInTheDocument()
    const dialog = await screen.findByRole('dialog', { name: 'Histórico' })
    await expect(
      within(dialog).getByText('Tudo o que mudou.'),
    ).toBeInTheDocument()
    await expect(
      within(dialog).getByRole('list', { name: 'Feed' }),
    ).toBeInTheDocument()
  },
}
