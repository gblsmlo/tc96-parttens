import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  ANCHOR,
  type CalendarTestRecord,
  CalendarViewScenario,
  createCalendarScenario,
  renderChip,
} from '../../fixtures/calendar-view-harness'

const moved: CalendarTestRecord = {
  end: '2026-08-12T15:00:00.000Z',
  id: 'moved',
  start: '2026-08-12T14:00:00.000Z',
  title: 'Reunião',
}
const movedNextDay: CalendarTestRecord = {
  end: '2026-08-13T15:00:00.000Z',
  id: 'moved',
  start: '2026-08-13T14:00:00.000Z',
  title: 'Reunião',
}
const otherOne: CalendarTestRecord = {
  end: '2026-08-13T15:00:00.000Z',
  id: 'other-1',
  start: '2026-08-13T14:00:00.000Z',
  title: 'Café',
}
const otherTwo: CalendarTestRecord = {
  end: '2026-08-14T15:00:00.000Z',
  id: 'other-2',
  start: '2026-08-14T14:00:00.000Z',
  title: 'Almoço',
}

const accept = fn(() => true)
const rejectSync = fn(() => false)
const rejectPromiseFalse = fn(() => Promise.resolve(false))
const rejectPromiseError = fn(() => Promise.reject(new Error('network')))
const throwing = fn((): boolean => {
  throw new Error('rejected')
})
const canceledReschedule = fn(() => true)

const pending: { settle?: (accepted: boolean) => void } = {}
const pendingReschedule = fn(
  () =>
    new Promise<boolean>((resolve) => {
      pending.settle = resolve
    }),
)

const overlayOf = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-dnd-overlay]')

const cellOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector(`[data-calendar-item-id="${id}"]`)
    ?.closest('[data-calendar-date]')
    ?.getAttribute('data-calendar-date')

async function startKeyboardDrag(canvasElement: HTMLElement) {
  within(canvasElement).getByRole('button', { name: 'Mover Reunião' }).focus()
  await userEvent.keyboard('[Space]')
  await waitFor(() =>
    expect(overlayOf(canvasElement)).not.toBeEmptyDOMElement(),
  )
}

async function dragMovedToNextDay(canvasElement: HTMLElement) {
  await startKeyboardDrag(canvasElement)
  const cellWidth =
    canvasElement
      .querySelector('[data-calendar-date="2026-08-12"]')
      ?.getBoundingClientRect().width ?? 0
  for (let step = 0; step < Math.round(cellWidth / 10); step += 1) {
    await userEvent.keyboard('[ArrowRight]')
  }
  await userEvent.keyboard('[Space]')
}

const meta = {
  args: {
    anchor: ANCHOR,
    mode: 'month',
    records: [moved, otherOne, otherTwo],
    renderRecord: renderChip,
  },
  argTypes: {
    anchor: { control: false },
    mode: { control: 'inline-radio', options: ['month', 'week', 'day'] },
    onRecordReschedule: { control: false },
    records: { control: false },
    renderRecord: { control: false },
  },
  component: CalendarViewScenario,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Calendar/Drag',
} satisfies Meta<typeof CalendarViewScenario>

export default meta
type Story = StoryObj<typeof meta>

export const AcceptedMove: Story = {
  args: {
    onRecordReschedule: accept,
  },
  play: async ({ canvasElement }) => {
    accept.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() =>
      expect(cellOf(canvasElement, 'moved')).toBe('2026-08-13'),
    )
    await expect(accept).toHaveBeenCalledWith(
      expect.objectContaining({ recordKey: 'moved' }),
    )
  },
}

export const RejectedMoveReturnsToSource: Story = {
  args: {
    onRecordReschedule: rejectSync,
  },
  play: async ({ canvasElement }) => {
    rejectSync.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() => expect(rejectSync).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(overlayOf(canvasElement)).toBeEmptyDOMElement())
    await expect(cellOf(canvasElement, 'moved')).toBe('2026-08-12')
  },
}

export const RejectedPromiseFalseReturnsToSource: Story = {
  args: {
    onRecordReschedule: rejectPromiseFalse,
  },
  play: async ({ canvasElement }) => {
    rejectPromiseFalse.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() => expect(rejectPromiseFalse).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(cellOf(canvasElement, 'moved')).toBe('2026-08-12'),
    )
  },
}

export const RejectedPromiseErrorReturnsToSource: Story = {
  args: {
    onRecordReschedule: rejectPromiseError,
  },
  play: async ({ canvasElement }) => {
    rejectPromiseError.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() => expect(rejectPromiseError).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(cellOf(canvasElement, 'moved')).toBe('2026-08-12'),
    )
  },
}

export const ThrowingCallbackRollsBack: Story = {
  args: {
    onRecordReschedule: throwing,
  },
  play: async ({ canvasElement }) => {
    throwing.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() => expect(throwing).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(overlayOf(canvasElement)).toBeEmptyDOMElement())
    await expect(cellOf(canvasElement, 'moved')).toBe('2026-08-12')
  },
}

export const PendingPromiseThenConfirmedByProps: Story = {
  args: {
    onRecordReschedule: pendingReschedule,
    scenario: createCalendarScenario(),
  },
  play: async ({ args, canvasElement }) => {
    pendingReschedule.mockClear()
    await dragMovedToNextDay(canvasElement)

    await waitFor(() => expect(pendingReschedule).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(overlayOf(canvasElement)).toBeEmptyDOMElement())
    await expect(cellOf(canvasElement, 'moved')).toBe('2026-08-13')

    pending.settle?.(true)
    args.scenario?.update({ records: [movedNextDay, otherOne, otherTwo] })

    await waitFor(() =>
      expect(cellOf(canvasElement, 'moved')).toBe('2026-08-13'),
    )
  },
}

export const CanceledDragIsIgnored: Story = {
  args: {
    onRecordReschedule: canceledReschedule,
  },
  play: async ({ canvasElement }) => {
    canceledReschedule.mockClear()
    await startKeyboardDrag(canvasElement)
    await userEvent.keyboard('[ArrowRight]')
    await userEvent.keyboard('[Escape]')

    await waitFor(() => expect(overlayOf(canvasElement)).toBeEmptyDOMElement())
    await expect(canceledReschedule).not.toHaveBeenCalled()
    await expect(cellOf(canvasElement, 'moved')).toBe('2026-08-12')
  },
}
