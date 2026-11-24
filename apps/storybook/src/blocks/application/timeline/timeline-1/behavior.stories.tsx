import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline1 } from '@tc96/blocks/application/timeline/timeline-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { events } from '../fixtures/timeline-1.ts'
import {
  type Timeline1Controls,
  timeline1ControlArgs,
} from './timeline-1-controls.ts'
import { ComposedTimeline1 } from './timeline-1-layouts.tsx'

const meta = {
  args: { ...timeline1ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline1/Behavior',
} satisfies Meta<Timeline1Controls & { onRetry: () => void }>

export default meta

type Story = StoryObj<typeof meta>

export const EachEventShowsActorActionAndTime: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('listitem').length).toBeGreaterThan(4)
    const event = canvasElement.querySelector('[data-event="approved"]')
    await expect(event).toHaveTextContent('Marina Costa')
    await expect(event).toHaveTextContent('aprovou a proposta comercial')
    await expect(event).toHaveTextContent('Hoje, 14:32')
  },
}

export const ActorInitialsMarkTheEvent: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('MC')).toBeVisible()
  },
}

export const StatusBadgeShowsOnlyWhenGiven: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '[data-event="approved"] [data-slot="badge"]',
      ),
    ).toHaveTextContent('Aprovada')
    await expect(
      canvasElement.querySelector('[data-event="comment"] [data-slot="badge"]'),
    ).toBeNull()
  },
}

export const AttachmentsListUnderTheEvent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Anexos' })
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    await expect(canvas.getByText('proposta-atlas.pdf')).toBeVisible()
  },
}

export const LastEventHasNoConnector: Story = {
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="timeline-item"]')
    await expect(items).toHaveLength(events.length)
    await expect(
      items[items.length - 1]?.querySelector(
        '[data-slot="timeline-connector"]',
      ),
    ).toBeNull()
    await expect(
      items[0]?.querySelector('[data-slot="timeline-connector"]'),
    ).not.toBeNull()
  },
}

export const EmptyEventsShowEmptyState: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma atividade ainda')).toBeVisible()
    await expect(canvas.queryByRole('list')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando atividades'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByText('Atividades')).toBeVisible()
    await expect(canvas.queryByText('Marina Costa')).toBeNull()
  },
}

export const ErrorShowsSurfaceAndRetryCallsOnRetry: Story = {
  args: { error: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar as atividades'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

export const ErrorWithoutOnRetryHidesTheButton: Story = {
  render: () => <Timeline1 error events={events} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverErrorAndEmpty: Story = {
  render: () => <Timeline1 error events={[]} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando atividades')).toBeVisible()
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.queryByText('Nenhuma atividade ainda')).toBeNull()
  },
}

export const ErrorWinsOverEmpty: Story = {
  render: () => <Timeline1 error events={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(canvas.queryByText('Nenhuma atividade ainda')).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <Timeline1
      events={events}
      labels={{ attachments: 'Arquivos', title: 'Histórico' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list', { name: 'Histórico' })).toBeVisible()
    await expect(canvas.getByRole('list', { name: 'Arquivos' })).toBeVisible()
  },
}
