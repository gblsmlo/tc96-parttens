import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal2 } from '@tc96/ui/blocks/data/legal/legal-2'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { contracts, owners } from '../fixtures/legal-2.ts'
import { type Legal2Controls, legal2ControlArgs } from './legal-2-controls.ts'
import { ComposedLegal2 } from './legal-2-layouts.tsx'

const meta = {
  args: {
    ...legal2ControlArgs,
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
  render: (args) => <ComposedLegal2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal2/Behavior',
} satisfies Meta<
  Legal2Controls & {
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

const recordTitle = 'Fornecimento de insumos com exclusividade'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles dos contratos',
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
}

export const TheHeadingNamesTheSection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Contratos' }),
    ).toBeVisible()
    await expect(canvas.getByText('6 contratos · 2 assinados')).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Contratos' }),
    ).toBeVisible()
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
      inToolbar.getByRole('button', { name: 'Novo contrato' }),
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
    ).toHaveLength(contracts.length)
  },
}

export const StatusSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, recordTitle))
    await pick(
      row.getByRole('combobox', { name: 'Status: Em revisão' }),
      'Assinado',
    )
    await expect(args.onStatusChange).toHaveBeenCalledWith('ctr-041', 'signed')
    await expect(
      row.getByRole('combobox', { name: 'Status: Assinado' }),
    ).toBeVisible()
  },
}

export const QueueSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, recordTitle))
    await pick(
      row.getByRole('combobox', { name: 'Fila: Negociação' }),
      'Assinatura',
    )
    await expect(args.onQueueChange).toHaveBeenCalledWith(
      'ctr-041',
      'signature',
    )
    await expect(
      row.getByRole('combobox', { name: 'Fila: Assinatura' }),
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
      await screen.findByRole('menuitemradio', { name: 'Vencido' }),
    )
    await expect(args.onStatusFilterChange).toHaveBeenCalledWith('expired')
    await expect(
      canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
    ).toHaveLength(1)
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal2 contracts={contracts} owners={owners} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando contratos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(
      canvas.getByRole('heading', { name: 'Contratos' }),
    ).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal2 contracts={[]} error onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os contratos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
