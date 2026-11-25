import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CalendarEventChip,
  CalendarEventChipOpenTrigger,
  CalendarEventChipTime,
  CalendarEventChipTitle,
  CalendarItemSkeleton,
  CalendarView,
} from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import {
  ANCHOR,
  type CalendarTestRecord,
  collectionOf,
  NOW,
  scheduleOf,
  TIME_ZONE,
} from '../collection/fixtures/calendar-view-harness'
import { CalendarCanvas, EventChipCanvas } from './calendar-canvas.tsx'
import { CalendarFrame } from './calendar-layouts.tsx'

const meta = {
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Calendar/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const slotClassName =
  'flex h-4 min-w-12 items-center justify-center rounded-sm border border-dashed px-1 text-[0.625rem] text-muted-foreground'

const anatomyRecords: CalendarTestRecord[] = [
  {
    end: '2026-08-10T13:00:00.000Z',
    id: 'timed',
    start: '2026-08-10T12:00:00.000Z',
    title: 'renderRecord',
  },
  {
    end: null,
    id: 'all-day',
    isAllDay: true,
    start: '2026-08-12T03:00:00.000Z',
    title: 'renderRecord',
  },
  {
    end: '2026-08-13T16:30:00.000Z',
    id: 'block',
    start: '2026-08-13T14:00:00.000Z',
    title: 'renderRecord',
  },
]

export const Anatomy: Story = {
  decorators: [CalendarCanvas],
  render: () => (
    <CalendarFrame>
      <CalendarView<CalendarTestRecord>
        anchor={new Date(ANCHOR)}
        collection={collectionOf(anatomyRecords)}
        getRecordSchedule={scheduleOf}
        mode="week"
        now={NOW}
        renderRecord={(record, context) => (
          <CalendarEventChip
            display={context.placement === 'time-grid' ? 'block' : 'chip'}
          >
            <CalendarEventChipTitle>
              <span className={slotClassName}>{record.title}</span>
            </CalendarEventChipTitle>
          </CalendarEventChip>
        )}
        timeZone={TIME_ZONE}
      />
    </CalendarFrame>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="calendar-view"]'),
    ).toHaveAttribute('data-calendar-mode', 'week')
    await expect(
      canvasElement.querySelector('[data-slot="calendar-time-grid"]'),
    ).not.toBeNull()
  },
}

export const EventChipAnatomy: Story = {
  decorators: [EventChipCanvas],
  render: () => (
    <div className="flex flex-col gap-3">
      <CalendarEventChip display="chip">
        <CalendarEventChipTime>
          <span className={slotClassName}>Time</span>
        </CalendarEventChipTime>
        <CalendarEventChipTitle>
          <span className={slotClassName}>Title</span>
        </CalendarEventChipTitle>
        <CalendarEventChipOpenTrigger aria-label="OpenTrigger" />
      </CalendarEventChip>
      <div className="@container-size/calendar-item h-14">
        <CalendarEventChip display="block">
          <CalendarEventChipTime>
            <span className={slotClassName}>Time</span>
          </CalendarEventChipTime>
          <CalendarEventChipTitle>
            <span className={slotClassName}>Title</span>
          </CalendarEventChipTitle>
          <CalendarEventChipOpenTrigger aria-label="OpenTrigger" />
        </CalendarEventChip>
      </div>
      <CalendarItemSkeleton label="CalendarItemSkeleton" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const slot of [
      'calendar-event-chip',
      'calendar-event-chip-time',
      'calendar-event-chip-title',
      'calendar-event-chip-open-trigger',
      'calendar-item-skeleton',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}
