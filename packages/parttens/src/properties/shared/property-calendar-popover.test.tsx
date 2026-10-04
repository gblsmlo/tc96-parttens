import { afterEach, describe, expect, mock, test } from 'bun:test'
import { useState } from 'react'

await import('../test/dom')

const { act, cleanup, fireEvent, render, screen } = await import(
  '@testing-library/react'
)
const { CalendarDaysIcon } = await import('lucide-react')
const { PropertyCalendarPopover } = await import('./property-calendar-popover')

afterEach(cleanup)

type Props = Partial<Parameters<typeof PropertyCalendarPopover>[0]>

function Harness(props: Props) {
  const [open, setOpen] = useState(false)

  return (
    <PropertyCalendarPopover
      ariaLabel="Prazo"
      icon={CalendarDaysIcon}
      label="Jun 19"
      onOpenChange={setOpen}
      open={open}
      {...props}
    >
      <p>calendário</p>
    </PropertyCalendarPopover>
  )
}

const openPopup = async () => {
  const trigger = screen.getByRole('button', { name: 'Prazo: Jun 19' })
  await act(async () => fireEvent.click(trigger))
  return trigger
}

describe('PropertyCalendarPopover', () => {
  test('names the trigger after the property and the label, with the icon', () => {
    render(<Harness />)

    const trigger = screen.getByRole('button', { name: 'Prazo: Jun 19' })
    expect(trigger.textContent).toBe('Jun 19')
    expect(trigger.querySelector('svg')?.classList.contains('size-3')).toBe(
      true,
    )
    expect(trigger.querySelector('.truncate')?.textContent).toBe('Jun 19')
    expect(trigger.hasAttribute('data-empty')).toBe(false)
  })

  test('marks an absent value as muted', () => {
    render(<Harness label="Sem data" muted />)

    expect(
      screen.getByRole('button', { name: 'Prazo: Sem data' }).dataset.empty,
    ).toBe('true')
  })

  test('opens a named dialog with the children and announces it', async () => {
    render(<Harness />)

    const trigger = await openPopup()

    expect(await screen.findByText('calendário')).toBeTruthy()
    expect(screen.getByRole('dialog', { name: 'Prazo' })).toBeTruthy()
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  test('shows the clear footer only with a clear action, and runs it', async () => {
    const onClear = mock()
    const { unmount } = render(<Harness />)
    await openPopup()
    await screen.findByText('calendário')
    expect(screen.queryByRole('button', { name: 'Limpar data' })).toBeNull()
    unmount()

    render(<Harness clear={{ label: 'Limpar data', onClear }} />)
    await openPopup()
    fireEvent.click(await screen.findByRole('button', { name: 'Limpar data' }))

    expect(onClear).toHaveBeenCalledTimes(1)
  })

  test('aligns to the start unless told otherwise, and lets the placement win', async () => {
    const positioner = () =>
      document.querySelector<HTMLElement>('[data-slot="popover-positioner"]')

    const first = render(<Harness />)
    await openPopup()
    await screen.findByText('calendário')
    expect(positioner()?.dataset.align).toBe('start')
    first.unmount()

    const second = render(<Harness align="center" />)
    await openPopup()
    await screen.findByText('calendário')
    expect(positioner()?.dataset.align).toBe('center')
    second.unmount()

    render(<Harness align="center" dropdownPlacement={{ align: 'end' }} />)
    await openPopup()
    await screen.findByText('calendário')
    expect(positioner()?.dataset.align).toBe('end')
  })

  test('does not open while disabled', async () => {
    render(<Harness disabled />)

    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'Prazo: Jun 19' })),
    )

    expect(screen.queryByText('calendário')).toBeNull()
  })
})
