import type { Meta, StoryObj } from '@storybook/react-vite'
import type {
  CalendarDate,
  CalendarRecordReschedule,
  CalendarSlot,
} from '@tc96/parttens'
import { useEffect, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { sleep } from '../../../../test-utils/sleep'
import { CalendarWorkspace } from '../../fixtures/calendar-workspace'
import { CalendarCanvas } from './calendar-canvas.tsx'
import { calendarControlArgs } from './calendar-controls.ts'
import { type CalendarSample, calendarSamples } from './calendar-data.ts'
import {
  CalendarFrame,
  ComposedCalendar,
  StatefulCalendar,
} from './calendar-layouts.tsx'

interface CalendarBehaviorArgs {
  onAction: (record: CalendarSample) => void
  onOpen: (record: CalendarSample) => void
  onRecordReschedule: (change: CalendarRecordReschedule<CalendarSample>) => void
  onSelectDay: (date: CalendarDate) => void
  onSelectSlot: (slot: CalendarSlot) => void
}

const meta = {
  decorators: [CalendarCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/Behavior',
} satisfies Meta<CalendarBehaviorArgs>

export default meta

type Story = StoryObj<CalendarBehaviorArgs>

const LOAD_DELAY = 2000

function LoadingWorkspace() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <CalendarWorkspace loading={loading} />
}

const calendarOf = (canvasElement: HTMLElement) => {
  const node = canvasElement.querySelector<HTMLElement>('[data-calendar-mode]')
  if (!node) throw new Error('The story did not render the calendar.')
  return node
}

const firstDateOf = (canvasElement: HTMLElement) =>
  calendarOf(canvasElement)
    .querySelector('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

const centerOf = (element: Element) => {
  const box = element.getBoundingClientRect()
  return element.ownerDocument.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2,
  )
}

const itemOf = (trigger: HTMLElement) => {
  const item = trigger.closest('article')
  if (!item) throw new Error('The open trigger is outside the item.')
  return item
}

export const LoadsIntoItems: Story = {
  render: () => <LoadingWorkspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(calendarOf(canvasElement)).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando compromisso' }).length,
    ).toBeGreaterThan(0)

    await waitFor(
      () => expect(calendarOf(canvasElement)).not.toHaveAttribute('aria-busy'),
      { timeout: LOAD_DELAY * 2 },
    )
    await expect(
      canvas.queryAllByRole('status', { name: 'Carregando compromisso' }),
    ).toHaveLength(0)
    await expect(
      (await canvas.findAllByRole('button', { name: /^Abrir / })).length,
    ).toBeGreaterThan(0)
  },
}

export const ModeSwitchesTheGrid: Story = {
  render: () => <CalendarWorkspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const weekStart = firstDateOf(canvasElement)
    await expect(
      canvasElement.querySelector('[data-slot="calendar-time-grid"]'),
    ).not.toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Mês' }))
    await waitFor(() =>
      expect(calendarOf(canvasElement)).toHaveAttribute(
        'data-calendar-mode',
        'month',
      ),
    )
    await expect(
      canvasElement.querySelector('[data-slot="calendar-month-grid"]'),
    ).not.toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'Semana' }))
    await waitFor(() =>
      expect(calendarOf(canvasElement)).toHaveAttribute(
        'data-calendar-mode',
        'week',
      ),
    )
    await expect(firstDateOf(canvasElement)).toBe(weekStart)
  },
}

export const AnchorMovesThePeriod: Story = {
  render: () => <CalendarWorkspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const weekStart = firstDateOf(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próximo período' }),
    )
    await waitFor(() => expect(firstDateOf(canvasElement)).not.toBe(weekStart))

    await userEvent.click(
      canvas.getByRole('button', { name: 'Período anterior' }),
    )
    await waitFor(() => expect(firstDateOf(canvasElement)).toBe(weekStart))
  },
}

export const OpenTriggerCoversTheItem: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => (
    <ComposedCalendar {...calendarControlArgs} onOpen={onOpen} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const open = canvas.getByRole('button', {
      name: 'Abrir Kickoff do trimestre',
    })
    const title = within(itemOf(open)).getByText('Kickoff do trimestre')

    const hit = centerOf(title)
    await expect(hit).toBe(open)
    await userEvent.click(hit as Element)
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'kickoff' }),
    )
  },
}

export const OpenTriggerTakesKeyboardFocus: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => (
    <ComposedCalendar {...calendarControlArgs} onOpen={onOpen} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const open = canvas.getByRole('button', {
      name: 'Abrir Kickoff do trimestre',
    })
    const item = itemOf(open)
    await expect(getComputedStyle(item).boxShadow).toBe('none')

    canvas.getByRole('button', { name: 'Mover Kickoff do trimestre' }).focus()
    await userEvent.tab()
    await expect(open).toHaveFocus()
    await waitFor(() =>
      expect(getComputedStyle(item).boxShadow).not.toBe('none'),
    )

    await userEvent.keyboard('{Enter}')
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'kickoff' }),
    )
  },
}

export const BlockTimeOpensTheItem: Story = {
  args: { onOpen: fn() },
  render: ({ onOpen }) => (
    <ComposedCalendar {...calendarControlArgs} onOpen={onOpen} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const open = canvas.getByRole('button', {
      name: 'Abrir Planejamento da sprint',
    })
    const block = itemOf(open)
    await expect(block).toHaveAttribute('data-display', 'block')

    const hit = centerOf(within(block).getByText('10:00'))
    await expect(hit).toBe(open)
    await userEvent.click(hit as Element)
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'planning' }),
    )
  },
}

export const ItemActionStaysAboveTheTrigger: Story = {
  args: { onAction: fn(), onOpen: fn() },
  render: ({ onAction, onOpen }) => (
    <ComposedCalendar
      {...calendarControlArgs}
      action
      onAction={onAction}
      onOpen={onOpen}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const action = within(canvasElement).getByRole('button', {
      name: 'Concluir Revisão do pipeline',
    })

    const hit = centerOf(action)
    await expect(hit?.closest('button')).toBe(action)
    await userEvent.click(hit as Element)
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(args.onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'pipeline' }),
    )
    await expect(args.onOpen).not.toHaveBeenCalled()
  },
}

export const SelectsTheSlotUnderThePointer: Story = {
  args: { onSelectSlot: fn() },
  render: ({ onSelectSlot }) => (
    <CalendarFrame>
      <StatefulCalendar
        initialRecords={calendarSamples}
        mode="week"
        onSelectSlot={onSelectSlot}
      />
    </CalendarFrame>
  ),
  play: async ({ args, canvasElement }) => {
    const column = canvasElement.querySelector<HTMLElement>(
      '[data-slot="calendar-time-grid"] [data-calendar-date="2026-08-09"]',
    )
    if (!column) throw new Error('The time grid has no August 9 column.')
    const box = column.getBoundingClientRect()
    const coords = {
      clientX: box.left + box.width / 2,
      clientY: box.top + (box.height * (10 * 60 + 37)) / 1440,
    }

    await userEvent.pointer([
      { coords, keys: '[MouseLeft>]', target: column },
      { coords, keys: '[/MouseLeft]', target: column },
    ])
    await expect(args.onSelectSlot).toHaveBeenCalledOnce()
    await expect(args.onSelectSlot).toHaveBeenLastCalledWith({
      day: { day: 9, month: 8, year: 2026 },
      endMinutes: 10 * 60 + 45,
      startMinutes: 10 * 60 + 30,
    })
  },
}

export const EmptyRendersTheBareGrid: Story = {
  render: () => (
    <CalendarFrame>
      <StatefulCalendar initialRecords={[]} mode="week" />
    </CalendarFrame>
  ),
  play: async ({ canvasElement }) => {
    const calendar = calendarOf(canvasElement)
    await expect(calendar).not.toHaveAttribute('aria-busy')
    await expect(
      calendar.querySelectorAll(
        '[data-slot="calendar-time-grid"] [data-calendar-date]',
      ),
    ).toHaveLength(7)
    await expect(
      calendar.querySelectorAll('[data-calendar-all-day-date]'),
    ).toHaveLength(7)
    await expect(calendar.querySelector('[data-calendar-item-id]')).toBeNull()
    await expect(
      calendar.querySelector('[data-slot="calendar-item-skeleton"]'),
    ).toBeNull()
    await expect(
      calendar.querySelector('[data-slot="calendar-now-line"]'),
    ).not.toBeNull()
  },
}

export const ResizesWithTheKeyboard: Story = {
  args: { onRecordReschedule: fn() },
  render: ({ onRecordReschedule }) => (
    <CalendarFrame>
      <StatefulCalendar
        initialRecords={calendarSamples}
        mode="week"
        onRecordReschedule={onRecordReschedule}
      />
    </CalendarFrame>
  ),
  play: async ({ args, canvasElement }) => {
    const handle = within(canvasElement).getByRole('button', {
      name: 'Mover Kickoff do trimestre',
    })

    handle.focus()
    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
    await expect(args.onRecordReschedule).toHaveBeenCalledOnce()
    await expect(args.onRecordReschedule).toHaveBeenLastCalledWith(
      expect.objectContaining({
        end: new Date('2026-08-10T13:45:00.000Z'),
        recordKey: 'kickoff',
        start: new Date('2026-08-10T12:00:00.000Z'),
      }),
    )

    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}')
    await expect(args.onRecordReschedule).toHaveBeenCalledTimes(2)
    await expect(args.onRecordReschedule).toHaveBeenLastCalledWith(
      expect.objectContaining({
        end: new Date('2026-08-10T13:45:00.000Z'),
        recordKey: 'kickoff',
        start: new Date('2026-08-10T11:45:00.000Z'),
      }),
    )
  },
}

const overflowTriggerName = /^Mostrar mais 1 item de /

export const MonthOverflowListsHiddenItems: Story = {
  render: () => (
    <CalendarFrame>
      <StatefulCalendar initialRecords={calendarSamples} mode="month" />
    </CalendarFrame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cell = canvasElement.querySelector<HTMLElement>(
      '[data-calendar-date="2026-08-12"]',
    )
    if (!cell) throw new Error('The month grid has no August 12 cell.')
    const visible = within(cell)
      .getAllByRole('button', { name: /^Abrir / })
      .map((button) => button.getAttribute('aria-label'))
    await expect(visible).toHaveLength(3)

    await userEvent.click(
      canvas.getByRole('button', { name: overflowTriggerName }),
    )
    const popup = await screen.findByRole('dialog')
    const hidden = within(popup)
      .getAllByRole('button', { name: /^Abrir / })
      .map((button) => button.getAttribute('aria-label'))
    await expect(hidden).toHaveLength(1)
    await expect(visible).not.toContain(hidden[0])

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const MonthOverflowTitleSelectsDay: Story = {
  args: { onSelectDay: fn() },
  render: ({ onSelectDay }) => (
    <CalendarFrame>
      <StatefulCalendar
        initialRecords={calendarSamples}
        mode="month"
        onSelectDay={onSelectDay}
      />
    </CalendarFrame>
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: overflowTriggerName }),
    )
    const popup = await screen.findByRole('dialog')
    await userEvent.click(
      within(popup).getByRole('button', { name: /^Mostrar todos os 4 itens/ }),
    )

    await expect(args.onSelectDay).toHaveBeenCalledOnce()
    await expect(args.onSelectDay).toHaveBeenLastCalledWith({
      day: 12,
      month: 8,
      year: 2026,
    })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}
