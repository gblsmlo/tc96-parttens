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
const scheduled: ScheduleValue = {
  ...emptyScheduleValue,
  allDay: false,
  endTime: '16:00',
  frequency: 'weekly',
  from: new Date(2026, 9, 26),
  reminders: ['30', '1440'],
  startTime: '14:00',
  until: '2026-12-18T12:00:00.000Z',
}

function Harness({
  onValueChange,
  value: initialValue = scheduled,
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

const click = (element: HTMLElement) =>
  act(async () => fireEvent.click(element))

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

describe('footerLayout rows', () => {
  test('shows each section with its current value', async () => {
    render(<Harness footerLayout="rows" />)
    const body = await openPopup()

    const rows = [...(popup() as HTMLElement).querySelectorAll('li')].filter(
      (item) => item.querySelector('[data-slot="schedule-section-row"]'),
    )
    expect(rows.map((row) => row.textContent)).toEqual([
      'Hora14:00 – 16:00',
      'RepetirSemanalmente · Até 18 de dez.',
      'Lembretes30 min antes +1',
    ])
    expect(
      body.getByRole('button', { name: 'Hora' }).getAttribute('aria-expanded'),
    ).toBe('false')
  })

  test('expands the editor under its row, one row at a time', async () => {
    render(<Harness footerLayout="rows" />)
    const body = await openPopup()

    const time = body.getByRole('button', { name: 'Hora' })
    await click(time)
    expect(time.getAttribute('aria-expanded')).toBe('true')
    expect(body.getByRole('switch', { name: 'Dia inteiro' })).toBeTruthy()

    const repeat = body.getByRole('button', { name: 'Repetir' })
    await click(repeat)
    expect(time.getAttribute('aria-expanded')).toBe('false')
    expect(repeat.getAttribute('aria-expanded')).toBe('true')
    expect(body.queryByRole('switch', { name: 'Dia inteiro' })).toBeNull()
    expect(body.getByRole('group', { name: 'Repetir' })).toBeTruthy()
    expect(body.getByRole('combobox', { name: /^Frequência/ })).toBeTruthy()

    await click(repeat)
    expect(repeat.getAttribute('aria-expanded')).toBe('false')
    expect(body.queryByRole('group', { name: 'Repetir' })).toBeNull()
  })

  test('keeps the popup open on a pick only while a row is open', async () => {
    render(<Harness footerLayout="rows" />)
    const body = await openPopup()

    await click(body.getByRole('button', { name: 'Lembretes' }))
    await click(presets().getByRole('button', { name: /^Amanhã/ }))
    expect(popup()).not.toBeNull()

    await click(body.getByRole('button', { name: 'Lembretes' }))
    await click(presets().getByRole('button', { name: /^Hoje/ }))
    await waitFor(() => expect(popup()).toBeNull())
  })

  test('disables a row without an anchor and shows its placeholder', async () => {
    render(<Harness footerLayout="rows" value={emptyScheduleValue} />)
    const body = await openPopup()

    const reminders = body.getByRole('button', { name: 'Lembretes' })
    expect(reminders.hasAttribute('disabled')).toBe(true)
    expect(reminders.textContent).toBe('LembretesAdicionar lembrete')
    expect(
      body.getByRole('button', { name: 'Hora' }).hasAttribute('disabled'),
    ).toBe(false)
  })

  test('drops the footer when dateOnly', async () => {
    render(<Harness dateOnly footerLayout="rows" />)
    await openPopup()

    expect(popup()?.querySelector('[data-slot="schedule-sections"]')).toBeNull()
  })
})

describe('footerLayout drill-in', () => {
  test('replaces the popup with the section editor and returns on back', async () => {
    const onValueChange = mock()
    render(<Harness footerLayout="drill-in" onValueChange={onValueChange} />)
    const body = await openPopup()

    const repeat = body.getByRole('button', { name: 'Repetir' })
    expect(repeat.getAttribute('aria-expanded')).toBeNull()
    await click(repeat)

    expect(
      popup()?.querySelector('[data-slot="schedule-detail"]'),
    ).not.toBeNull()
    expect(screen.queryByRole('list', { name: 'Atalhos de data' })).toBeNull()
    expect(body.getByRole('combobox', { name: /^Frequência/ })).toBeTruthy()
    expect(document.activeElement).toBe(
      body.getByRole('button', { name: 'Voltar' }),
    )

    await click(body.getByRole('button', { name: 'Voltar' }))
    expect(popup()?.querySelector('[data-slot="schedule-detail"]')).toBeNull()
    expect(screen.getByRole('list', { name: 'Atalhos de data' })).toBeTruthy()
    expect(document.activeElement).toBe(
      body.getByRole('button', { name: 'Repetir' }),
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })

  test('edits through the detail view and closes on a pick back in the main view', async () => {
    const onValueChange = mock()
    render(<Harness footerLayout="drill-in" onValueChange={onValueChange} />)
    const body = await openPopup()

    await click(body.getByRole('button', { name: 'Hora' }))
    await click(body.getByRole('switch', { name: 'Dia inteiro' }))
    expect(onValueChange.mock.calls.at(-1)?.[0]).toMatchObject({
      allDay: true,
      endTime: '',
      startTime: '',
    })

    await click(body.getByRole('button', { name: 'Voltar' }))
    expect(body.getByRole('button', { name: 'Hora' }).textContent).toContain(
      'Dia inteiro',
    )
    await click(presets().getByRole('button', { name: /^Amanhã/ }))
    await waitFor(() => expect(popup()).toBeNull())
  })
})
