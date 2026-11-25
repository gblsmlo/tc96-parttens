import type { Meta, StoryObj } from '@storybook/react-vite'
import { Agenda1 } from '@tc96/ui/blocks/data/agenda/agenda-1'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  agendaAnchor,
  agendaNow,
  agendaTimeZone,
  entries,
  owners,
} from '../fixtures/agenda-1.ts'
import { agenda1ControlArgs } from './agenda-1-controls.ts'
import {
  ComposedAgenda1,
  type ComposedAgenda1Props,
} from './agenda-1-layouts.tsx'

const callbacks = {
  onAnchorChange: fn(),
  onCancel: fn(),
  onCollapsedGroupIdsChange: fn(),
  onCreate: fn(),
  onGroupByChange: fn(),
  onKindFilterChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onOwnerFilterChange: fn(),
  onPeriodChange: fn(),
  onReschedule: fn(),
  onRetry: fn(),
}

type BehaviorArgs = ComposedAgenda1Props & { onRetry: () => void }

const meta = {
  args: { ...agenda1ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Agenda/Agenda1/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<typeof meta>

const callTitle = 'Ligação com o contador'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', { name: 'Controles da agenda' })

const calendarOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>('[data-slot="calendar-view"]')

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const closeMenus = async () => {
  await userEvent.keyboard('{Escape}')
  if (screen.queryAllByRole('menu').length > 0)
    await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0))
}

const directProps = {
  anchor: agendaAnchor,
  entries,
  now: agendaNow,
  owners,
  timeZone: agendaTimeZone,
}

export const TheHeadingNamesThePeriod: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    await expect(
      toolbar.getByRole('heading', { level: 2, name: 'Agenda' }),
    ).toBeVisible()
    await expect(toolbar.getByText(/23.*29 de nov/)).toBeVisible()
    await expect(calendarOf(canvasElement)).toHaveAttribute(
      'data-calendar-mode',
      'week',
    )
  },
}

export const NextAndPreviousMoveByOnePeriod: Story = {
  play: async ({ args, canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    await userEvent.click(
      toolbar.getByRole('button', { name: 'Próximo período' }),
    )
    await expect(args.onAnchorChange).toHaveBeenLastCalledWith('2026-12-02')
    await expect(toolbar.getByText(/30 de nov.*6 de dez/)).toBeVisible()
    await expect(
      await within(canvasElement).findByRole('article', {
        name: 'Compromisso: Reunião de planejamento de 2027',
      }),
    ).toBeVisible()
    await userEvent.click(
      toolbar.getByRole('button', { name: 'Período anterior' }),
    )
    await expect(args.onAnchorChange).toHaveBeenLastCalledWith(agendaAnchor)
  },
}

export const TodayReturnsToTheCurrentDay: Story = {
  args: { anchor: '2026-12-16' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Hoje' }),
    )
    await expect(args.onAnchorChange).toHaveBeenLastCalledWith(agendaAnchor)
    await expect(
      await within(canvasElement).findByRole('article', {
        name: `Compromisso: ${callTitle}`,
      }),
    ).toBeVisible()
  },
}

export const PeriodSwitchesTheGrid: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Período' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Mês' }),
    )
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith('month')
    await closeMenus()
    await expect(calendarOf(canvasElement)).toHaveAttribute(
      'data-calendar-mode',
      'month',
    )
    await expect(
      within(toolbarOf(canvasElement)).getByText('novembro de 2026'),
    ).toBeVisible()
  },
}

export const MonthMovesByWholeMonths: Story = {
  args: { period: 'month' },
  play: async ({ args, canvasElement }) => {
    const toolbar = within(toolbarOf(canvasElement))
    await userEvent.click(
      toolbar.getByRole('button', { name: 'Próximo período' }),
    )
    await expect(args.onAnchorChange).toHaveBeenLastCalledWith('2026-12-01')
    await expect(toolbar.getByText('dezembro de 2026')).toBeVisible()
  },
}

export const ItemsShowTheirKind: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('article', {
        name: 'Prazo: Entrega da declaração anual',
      }),
    ).toHaveAttribute('data-tone', 'destructive')
    await expect(
      canvas.getByRole('article', {
        name: 'Vencimento: Enviar relatório de horas',
      }),
    ).toHaveAttribute('data-tone', 'warning')
    await expect(
      canvas.getByRole('article', {
        name: 'Tarefa: Revisar contrato de fornecimento',
      }),
    ).toHaveAttribute('data-completed')
  },
}

export const ItemsOpenTheEntry: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: `Abrir detalhes: ${callTitle}`,
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'ligacao-contador' }),
    )
  },
}

export const ResizingReschedulesAnAppointment: Story = {
  play: async ({ args, canvasElement }) => {
    within(canvasElement)
      .getByRole('button', { name: `Mover ${callTitle}` })
      .focus()
    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
    await expect(args.onReschedule).toHaveBeenCalledOnce()
    await expect(args.onReschedule).toHaveBeenLastCalledWith(
      expect.objectContaining({
        allDay: false,
        end: '2026-11-25T14:45:00.000Z',
        entry: expect.objectContaining({ id: 'ligacao-contador' }),
        start: '2026-11-25T14:00:00.000Z',
      }),
    )
  },
}

export const WithoutOnRescheduleNothingMoves: Story = {
  args: { reschedulable: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryAllByRole('button', { name: /^Mover / }),
    ).toHaveLength(0)
  },
}

export const TheMonthOverflowOpensTheDay: Story = {
  args: { period: 'month' },
  play: async ({ args, canvasElement }) => {
    const cell = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-11-25"]',
    )
    if (!cell) throw new Error('The month grid has no November 25 cell.')
    await userEvent.click(
      within(cell).getByRole('button', { name: /^Mostrar mais 1 item de / }),
    )
    const popup = await screen.findByRole('dialog')
    await userEvent.click(
      within(popup).getByRole('button', { name: /^Mostrar todos os 4 itens/ }),
    )
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith('day')
    await expect(args.onAnchorChange).toHaveBeenLastCalledWith('2026-11-25')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(calendarOf(canvasElement)).toHaveAttribute(
      'data-calendar-mode',
      'day',
    )
  },
}

export const CreateFromTheToolbar: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(toolbarOf(canvasElement)).getByRole('button', {
        name: 'Novo compromisso',
      }),
    )
    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenLastCalledWith()
  },
}

export const CreateFromAnEmptySlot: Story = {
  play: async ({ args, canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-slot="calendar-time-grid"] [data-calendar-date="2026-11-25"]',
    )
    if (!column) throw new Error('The time grid has no November 25 column.')
    column.scrollIntoView({ block: 'start' })
    const box = column.getBoundingClientRect()
    const coords = {
      clientX: box.left + box.width / 2,
      clientY: box.top + (box.height * (10 * 60 + 37)) / 1440,
    }
    await userEvent.pointer([
      { coords, keys: '[MouseLeft>]', target: column },
      { coords, keys: '[/MouseLeft]', target: column },
    ])
    await expect(args.onCreate).toHaveBeenCalledOnce()
    await expect(args.onCreate).toHaveBeenLastCalledWith({
      end: '2026-11-25T13:45:00.000Z',
      start: '2026-11-25T13:30:00.000Z',
    })
  },
}

export const TheListGroupsByDay: Story = {
  args: { mode: 'list' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: /23 de novembro/ }),
    ).toBeVisible()
    await expect(
      within(canvas.getByRole('region', { name: /25 de novembro/ })).getByRole(
        'button',
        { name: `Abrir detalhes: ${callTitle}` },
      ),
    ).toBeVisible()
    await expect(calendarOf(canvasElement)).toBeNull()
  },
}

export const TheTableShowsTheEntryColumns: Story = {
  args: { mode: 'table' },
  play: async ({ canvasElement }) => {
    const headers = Array.from(
      canvasElement.querySelectorAll('[data-slot="data-table"] thead th'),
      (cell) => cell.textContent,
    )
    await expect(headers).toEqual([
      'Título',
      'Tipo',
      'Quando',
      'Modalidade',
      'Local',
      'Responsável',
      'Ações',
    ])
  },
}

export const CancelReportsTheAppointment: Story = {
  args: { mode: 'list' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', {
        name: 'Cancelar Preparar pauta da reunião mensal',
      }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: `Cancelar ${callTitle}` }),
    )
    await expect(args.onCancel).toHaveBeenLastCalledWith('ligacao-contador')
  },
}

export const KindFilterReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Tipo' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Prazo' }),
    )
    await expect(args.onKindFilterChange).toHaveBeenLastCalledWith(['deadline'])
    await closeMenus()
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('article', { name: `Compromisso: ${callTitle}` }),
    ).toBeNull()
    await expect(
      canvas.getByRole('article', {
        name: 'Prazo: Entrega da declaração anual',
      }),
    ).toBeVisible()
  },
}

export const PendingKeepsTheToolbar: Story = {
  render: () => <Agenda1 {...directProps} pending />,
  play: async ({ canvasElement }) => {
    await expect(calendarOf(canvasElement)).toHaveAttribute('aria-busy', 'true')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Hoje' }),
    ).toBeVisible()
  },
}

export const PendingListShowsTheSkeleton: Story = {
  render: () => <Agenda1 {...directProps} mode="list" pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando compromissos'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const ErrorOffersRetry: Story = {
  render: ({ onRetry }) => <Agenda1 {...directProps} error onRetry={onRetry} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível carregar a agenda'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

export const EmptyListShowsTheMessage: Story = {
  args: { empty: true, mode: 'list' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nada na agenda neste período.'),
    ).toBeVisible()
  },
}
