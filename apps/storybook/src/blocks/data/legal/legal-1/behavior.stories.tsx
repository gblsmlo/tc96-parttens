import type { Meta, StoryObj } from '@storybook/react-vite'
import { Legal1 } from '@tc96/ui/blocks/data/legal/legal-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { cases, owners } from '../fixtures/legal-1.ts'
import { type Legal1Controls, legal1ControlArgs } from './legal-1-controls.ts'
import { ComposedLegal1 } from './legal-1-layouts.tsx'

const meta = {
  args: {
    ...legal1ControlArgs,
    onCreate: fn(),
    onExport: fn(),
    onModeChange: fn(),
    onOpen: fn(),
    onOwnerChange: fn(),
    onPhaseChange: fn(),
    onQueueChange: fn(),
    onRetry: fn(),
    onStatusChange: fn(),
    onStatusFilterChange: fn(),
    onViewChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal1/Behavior',
} satisfies Meta<
  Legal1Controls & {
    onCreate: () => void
    onExport: () => void
    onModeChange: () => void
    onOpen: () => void
    onOwnerChange: () => void
    onPhaseChange: () => void
    onQueueChange: () => void
    onRetry: () => void
    onStatusChange: () => void
    onStatusFilterChange: () => void
    onViewChange: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

const caseTitle = 'Ação de cobrança contra fornecedor de farinha'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles dos processos',
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

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Processos' }),
    ).toBeVisible()
  },
}

export const TheViewSwitcherShowsOnlyMatters: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todos' }),
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Casos' }))
    await expect(args.onViewChange).toHaveBeenCalledWith('matters')
    await expect(
      canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
    ).toHaveLength(2)
    await expect(
      within(canvasElement).getByRole('button', { name: 'Casos' }),
    ).toBeVisible()
  },
}

export const TitleAndNumberSitInSeparateColumns: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('columnheader', { name: 'Título' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('columnheader', { name: 'Número do processo' }),
    ).toBeVisible()
    const titleCell = canvas.getByText(caseTitle).closest('td')
    await expect(titleCell).not.toHaveTextContent('5001234-18.2026.8.26.9001')
  },
}

export const TheProcessNumberHasACopyButton: Story = {
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, caseTitle))
    await expect(row.getByText('5001234-18.2026.8.26.9001')).toBeVisible()
    await expect(
      row.getByRole('button', { name: 'Copiar número do processo' }),
    ).toBeVisible()
    const matter = within(
      rowOf(canvasElement, 'Parecer sobre reajuste de locação comercial'),
    )
    await expect(matter.getByText('Sem número')).toBeVisible()
    await expect(
      matter.queryByRole('button', { name: 'Copiar número do processo' }),
    ).toBeNull()
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
      inToolbar.getByRole('button', { name: 'Novo processo' }),
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
    ).toHaveLength(cases.length)
  },
}

export const ModeTabsSwitchToTheKanban: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseMode(canvasElement, 'Kanban')
    await expect(args.onModeChange).toHaveBeenCalledWith('kanban')
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelector('[data-pattern="kanban-card"]'),
    ).not.toBeNull()
    await expect(
      within(canvasElement).getAllByText('Instrução').length,
    ).toBeGreaterThan(0)
  },
}

export const StatusSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, caseTitle))
    await pick(row.getByRole('combobox', { name: 'Status: Ativo' }), 'Suspenso')
    await expect(args.onStatusChange).toHaveBeenCalledWith(
      'proc-101',
      'suspended',
    )
    await expect(
      row.getByRole('combobox', { name: 'Status: Suspenso' }),
    ).toBeVisible()
  },
}

export const QueueSelectReportsTheNewValue: Story = {
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, caseTitle))
    await pick(
      row.getByRole('combobox', { name: 'Fila: Audiências' }),
      'Revisão',
    )
    await expect(args.onQueueChange).toHaveBeenCalledWith('proc-101', 'review')
    await expect(
      row.getByRole('combobox', { name: 'Fila: Revisão' }),
    ).toBeVisible()
  },
}

export const StatusFilterKeepsMatchingCases: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Status' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Encerrado' }),
    )
    await expect(args.onStatusFilterChange).toHaveBeenCalledWith('closed')
    await expect(
      canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr'),
    ).toHaveLength(1)
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Legal1 cases={cases} owners={owners} pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando processos')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Legal1 cases={[]} error onRetry={args.onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar os processos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
