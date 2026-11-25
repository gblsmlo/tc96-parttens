import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal3 } from '@tc96/ui/blocks/data/legal/legal-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { deadlines, owners } from '../fixtures/legal-3.ts'
import { type Legal3Controls, legal3ControlArgs } from './legal-3-controls.ts'
import { ComposedLegal3 } from './legal-3-layouts.tsx'

const meta = {
  args: {
    ...legal3ControlArgs,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onOwnerChange: fn(),
    onQueueChange: fn(),
    onRetry: fn(),
    onStatusChange: fn(),
    onStatusFilterChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal3/Behavior',
} satisfies Meta<
  Legal3Controls & {
    onCreate: () => void
    onExport: () => void
    onModeChange: () => void
    onOpen: () => void
    onOwnerChange: () => void
    onQueueChange: () => void
    onRetry: () => void
    onStatusChange: () => void
    onStatusFilterChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const recordTitle = 'Contestação da TransVale'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles dos prazos',
  })

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Exibição' }),
  )
  return screen.findByRole('menu')
}

const chooseMode = async (canvasElement: HTMLElement, name: string) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitemradio', { name }))
}

const rowOf = (canvasElement: HTMLElement, title: string) =>
  within(canvasElement).getByText(title).closest('tr') as HTMLElement

const pick = async (trigger: HTMLElement, option: string) => {
  await userEvent.click(trigger)
  await userEvent.click(await screen.findByRole('option', { name: option }))
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
}

export const TheHeadingNamesTheSection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Prazos' }),
    ).toBeVisible()
    await expect(canvas.getByText('6 prazos · 4 pendentes')).toBeVisible()
    await expect(canvas.getByRole('region', { name: 'Prazos' })).toBeVisible()
  },
}

export const TheToolbarIsPlain: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = toolbarOf(canvasElement)
    await expect(toolbar).toHaveAttribute('data-mode', 'plain')
    const inToolbar = within(toolbar)
    await expect(
      inToolbar.getByRole('button', { name: 'Exibição' }),
    ).toBeVisible()
    await expect(
      inToolbar.getByRole('button', { name: 'Novo prazo' }),
    ).toBeVisible()
    await expect(inToolbar.queryByRole('searchbox')).toBeNull()
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseMode(canvasElement, 'Lista')
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(deadlines.length)
  },
}

export const ModeTabsSwitchToTheAgenda: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseMode(canvasElement, 'Agenda')
    await expect(args.onModeChange).toHaveBeenCalledWith('calendar')
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="calendar-event-chip"]'),
    ).not.toBeNull()
  },
}

export const StatusSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, recordTitle))
    await pick(
      row.getByRole('combobox', { name: 'Status: Pendente' }),
      'Cumprido',
    )
    await expect(args.onStatusChange).toHaveBeenCalledWith('prz-201', 'done')
    await expect(
      row.getByRole('combobox', { name: 'Status: Cumprido' }),
    ).toBeVisible()
  },
}

export const QueueSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, recordTitle))
    await pick(
      row.getByRole('combobox', { name: 'Fila: Elaboração' }),
      'Revisão',
    )
    await expect(args.onQueueChange).toHaveBeenCalledWith('prz-201', 'review')
    await expect(
      row.getByRole('combobox', { name: 'Fila: Revisão' }),
    ).toBeVisible()
  },
}

export const StatusFilterKeepsMatchingRecords: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Status' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Perdido' }),
    )
    await expect(args.onStatusFilterChange).toHaveBeenCalledWith('missed')
    await expect(
      canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
    ).toHaveLength(1)
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal3 deadlines={deadlines} owners={owners} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando prazos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('heading', { name: 'Prazos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal3 deadlines={[]} error onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os prazos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
