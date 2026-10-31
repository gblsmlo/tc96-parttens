import { describe, expect, test } from 'bun:test'
import { calendarEventChipVariants } from './calendar-event-chip'

describe('calendarEventChipVariants', () => {
  test('tightens the block padding only below the narrow lane width', () => {
    const block = calendarEventChipVariants({ display: 'block' })

    expect(block).toContain('px-2')
    expect(block).toContain('[@container_calendar-item_(width<3.5rem)]:px-px')
  })

  test('keeps the chip display padding independent of the lane width', () => {
    expect(calendarEventChipVariants({ display: 'chip' })).not.toContain(
      'width<',
    )
  })
})
