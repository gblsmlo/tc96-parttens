import { afterEach, describe, expect, mock, test } from 'bun:test'
import { useState } from 'react'

await import('../../test/dom')

const { act, cleanup, fireEvent, render, screen, waitFor, within } =
  await import('@testing-library/react')
const { ScheduleProperty } = await import('./schedule-property')
const { emptyScheduleValue } = await import('./schedule-value')

type ScheduleValue = typeof emptyScheduleValue
type Props = Partial<Parameters<typeof ScheduleProperty>[0]>

afterEach(cleanup)

const today = new Date(2026, 9, 7)
const october26 = new Date(2026, 9, 26)

function Harness({
  onValueChange,
  value: initialValue = emptyScheduleValue,
  ...props
}: Props) {
  const [value, setValue] = useState<ScheduleValue>(initialValue)

  return (
    <ScheduleProperty
      ariaLabel="Data"
      onValueChange={(next) => {
        setValue(next)
        onValueChange?.(next)
      }}
      today={today}
      value={value}
      {...props}
    />
  )
}

const popup = () =>
  document.querySelector<HTMLElement>('[data-slot="schedule-popup"]')

const openPopup = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole('button', { name: /^Data:/ })),
  )
  await waitFor(() => expect(popup()).not.toBeNull())
  return within(popup() as HTMLElement)
}

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

describe('ScheduleProperty', () => {
  test('is a labelled surface without a handler, with the frequency in its name', () => {
    render(
      <ScheduleProperty
        ariaLabel="Data"
        value={{ ...emptyScheduleValue, frequency: 'weekly', from: october26 }}
      />,
    )

    expect(screen.queryByRole('button')).toBeNull()
    expect(
      screen.getByRole('img', { name: 'Data: 26 de out · Semanalmente' }),
    ).toBeTruthy()
  })

  test('falls back to the absence tone when empty', () => {
    render(<Harness ariaLabel="Prazo" fallback="Sem prazo" />)

    expect(
      screen.getByRole('button', { name: 'Prazo: Sem prazo' }).dataset.empty,
    ).toBe('true')
  })

  test('picks a preset, emits the day and closes', async () => {
    const onValueChange = mock()
    render(<Harness onValueChange={onValueChange} />)
    await openPopup()

    expect(presets().getAllByRole('button')).toHaveLength(5)
    await act(async () =>
      fireEvent.click(presets().getByRole('button', { name: /^Amanhã/ })),
    )

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange.mock.calls[0]?.[0].from).toEqual(new Date(2026, 9, 8))
    await waitFor(() => expect(popup()).toBeNull())
    expect(screen.getByRole('button', { name: 'Data: 8 de out' })).toBeTruthy()
  })

  test('stays open while the time section is open', async () => {
    render(<Harness value={{ ...emptyScheduleValue, from: october26 }} />)
    const body = await openPopup()

    const time = body.getByRole('button', { name: 'Hora' })
    expect(time.getAttribute('aria-pressed')).toBe('false')
    expect(body.queryByRole('switch', { name: 'Dia inteiro' })).toBeNull()
    await act(async () => fireEvent.click(time))
    expect(time.getAttribute('aria-pressed')).toBe('true')

    await act(async () =>
      fireEvent.click(presets().getByRole('button', { name: /^Hoje/ })),
    )

    expect(popup()).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Data: 7 de out' })).toBeTruthy()
  })

  test('clears the times when the day becomes all-day', async () => {
    const onValueChange = mock()
    render(
      <Harness
        onValueChange={onValueChange}
        value={{
          ...emptyScheduleValue,
          allDay: false,
          endTime: '16:00',
          from: october26,
          startTime: '14:00',
        }}
      />,
    )
    const body = await openPopup()
    await act(async () =>
      fireEvent.click(body.getByRole('button', { name: 'Hora' })),
    )

    const allDay = body.getByRole('switch', { name: 'Dia inteiro' })
    expect(allDay.getAttribute('aria-checked')).toBe('false')
    await act(async () => fireEvent.click(allDay))

    expect(onValueChange.mock.calls.at(-1)?.[0]).toMatchObject({
      allDay: true,
      endTime: '',
      startTime: '',
    })
  })

  test('clearing the day also clears the recurrence and reminders', async () => {
    const onValueChange = mock()
    render(
      <Harness
        onValueChange={onValueChange}
        value={{
          ...emptyScheduleValue,
          frequency: 'weekly',
          from: october26,
          reminders: ['30'],
          until: '2026-12-18T12:00:00.000Z',
        }}
      />,
    )
    await openPopup()

    await act(async () =>
      fireEvent.click(presets().getByRole('button', { name: 'Sem data' })),
    )

    expect(onValueChange.mock.calls[0]?.[0]).toMatchObject({
      frequency: null,
      from: null,
      reminders: [],
      until: null,
    })
  })

  test('picking the current day closes without emitting', async () => {
    const onValueChange = mock()
    render(
      <Harness
        onValueChange={onValueChange}
        value={{ ...emptyScheduleValue, from: today }}
      />,
    )
    await openPopup()

    await act(async () =>
      fireEvent.click(presets().getByRole('button', { name: /^Hoje/ })),
    )

    expect(onValueChange).not.toHaveBeenCalled()
    await waitFor(() => expect(popup()).toBeNull())
  })

  test('shows the reminders in option order and keeps the popup open on a pick', async () => {
    render(
      <Harness
        value={{
          ...emptyScheduleValue,
          from: october26,
          reminders: ['1440', '30'],
        }}
      />,
    )
    const body = await openPopup()

    const reminders = body.getByRole('button', { name: 'Lembretes' })
    expect(reminders.getAttribute('aria-pressed')).toBe('false')
    expect(body.queryByRole('button', { name: /^Remover lembrete/ })).toBeNull()
    await act(async () => fireEvent.click(reminders))

    expect(
      body
        .getAllByRole('button', { name: /^Remover lembrete/ })
        .map((chip) => chip.getAttribute('aria-label')),
    ).toEqual(['Remover lembrete 30 min antes', 'Remover lembrete 1 dia antes'])

    await act(async () =>
      fireEvent.click(presets().getByRole('button', { name: /^Amanhã/ })),
    )
    expect(popup()).not.toBeNull()
  })

  test('disables Lembretes without an anchor unless the consumer enables it', async () => {
    const first = render(<Harness />)
    let body = await openPopup()
    expect(
      body.getByRole('button', { name: 'Lembretes' }).hasAttribute('disabled'),
    ).toBe(true)
    first.unmount()

    render(<Harness remindersEnabled />)
    body = await openPopup()
    expect(
      body.getByRole('button', { name: 'Lembretes' }).hasAttribute('disabled'),
    ).toBe(false)
  })

  test('leaves the Repetir toggle without an icon', async () => {
    render(<Harness value={{ ...emptyScheduleValue, from: october26 }} />)
    const body = await openPopup()

    expect(
      body.getByRole('button', { name: 'Repetir' }).querySelector('svg'),
    ).toBeNull()
  })

  test('disables Repetir without an anchor unless the consumer enables it', async () => {
    const first = render(<Harness />)
    let body = await openPopup()
    expect(
      body.getByRole('button', { name: 'Repetir' }).hasAttribute('disabled'),
    ).toBe(true)
    first.unmount()

    render(<Harness recurrenceEnabled />)
    body = await openPopup()
    expect(
      body.getByRole('button', { name: 'Repetir' }).hasAttribute('disabled'),
    ).toBe(false)
  })

  test('drops the time, recurrence and reminders footer when dateOnly', async () => {
    render(<Harness dateOnly />)
    const body = await openPopup()

    expect(body.queryByRole('button', { name: 'Hora' })).toBeNull()
    expect(body.queryByRole('button', { name: 'Repetir' })).toBeNull()
    expect(body.queryByRole('button', { name: 'Lembretes' })).toBeNull()
  })

  test('replaces the copy through labels', async () => {
    render(<Harness labels={{ noDate: 'No date', today: 'Today' }} />)
    await openPopup()

    expect(screen.getByRole('button', { name: 'Data: No date' })).toBeTruthy()
    expect(presets().getByRole('button', { name: /^Today/ })).toBeTruthy()
  })
})
