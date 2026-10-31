import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  emptyScheduleValue,
  ScheduleProperty,
  type ScheduleValue,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

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

const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

const popup = () =>
  document.querySelector<HTMLElement>('[data-slot="schedule-popup"]')

async function openPopup(canvasElement: HTMLElement) {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: /^Data:/ }),
  )

  return waitFor(() => {
    const opened = popup()
    if (!opened) throw new Error('The schedule popup did not open.')
    return within(opened)
  })
}

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

const meta = {
  args: {
    ariaLabel: 'Data',
    footerLayout: 'rows',
    onValueChange: fn((_value: ScheduleValue) => {}),
    today: new Date(2026, 9, 7),
    value: scheduled,
  },
  component: ScheduleProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-176 items-start p-4">
        <Story />
      </div>
    ),
  ],
  parameters: cossCalendarContrast,
  render: function Schedule({ onValueChange, ...args }) {
    const [value, setValue] = useState(args.value)

    return (
      <ScheduleProperty
        {...args}
        onValueChange={(next) => {
          setValue(next)
          onValueChange?.(next)
        }}
        value={value}
      />
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Footer Layouts',
} satisfies Meta<typeof ScheduleProperty>

export default meta

type Story = StoryObj<typeof meta>

export const RowsShowCurrentValues: Story = {
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    const rows = Array.from(
      (popup() as HTMLElement).querySelectorAll('li'),
    ).filter((item) => item.querySelector('[data-slot="schedule-section-row"]'))
    await expect(rows.map((row) => row.textContent)).toEqual([
      'Hora14:00 – 16:00',
      'RepetirSemanalmente · Até 18 de dez.',
      'Lembretes30 min antes +1',
    ])
    await expect(body.getByRole('button', { name: 'Hora' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  },
}

export const RowsExpandOneAtATime: Story = {
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    const time = body.getByRole('button', { name: 'Hora' })
    await userEvent.click(time)
    await expect(time).toHaveAttribute('aria-expanded', 'true')
    await expect(
      body.getByRole('switch', { name: 'Dia inteiro' }),
    ).toBeInTheDocument()

    const repeat = body.getByRole('button', { name: 'Repetir' })
    await userEvent.click(repeat)
    await expect(time).toHaveAttribute('aria-expanded', 'false')
    await expect(repeat).toHaveAttribute('aria-expanded', 'true')
    await expect(body.queryByRole('switch', { name: 'Dia inteiro' })).toBeNull()
    await expect(
      body.getByRole('group', { name: 'Repetir' }),
    ).toBeInTheDocument()
    await expect(
      body.getByRole('combobox', { name: /^Frequência/ }),
    ).toBeInTheDocument()

    await userEvent.click(repeat)
    await expect(repeat).toHaveAttribute('aria-expanded', 'false')
    await expect(body.queryByRole('group', { name: 'Repetir' })).toBeNull()
  },
}

export const RowsKeepPopupOpenOnlyWhileRowIsOpen: Story = {
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await userEvent.click(body.getByRole('button', { name: 'Lembretes' }))
    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))
    await expect(popup()).not.toBeNull()

    await userEvent.click(body.getByRole('button', { name: 'Lembretes' }))
    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))
    await waitFor(() => expect(popup()).toBeNull())
  },
}

export const RowWithoutAnchorIsDisabled: Story = {
  args: { value: emptyScheduleValue },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    const reminders = body.getByRole('button', { name: 'Lembretes' })
    await expect(reminders).toBeDisabled()
    await expect(reminders.textContent).toBe('LembretesAdicionar lembrete')
    await expect(body.getByRole('button', { name: 'Hora' })).toBeEnabled()
  },
}

export const RowsDroppedWhenDateOnly: Story = {
  args: { dateOnly: true },
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement)

    await expect(
      popup()?.querySelector('[data-slot="schedule-sections"]'),
    ).toBeNull()
  },
}

export const DrillInReplacesPopupAndReturns: Story = {
  args: { footerLayout: 'drill-in' },
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)

    const repeat = body.getByRole('button', { name: 'Repetir' })
    await expect(repeat).not.toHaveAttribute('aria-expanded')
    await userEvent.click(repeat)

    await expect(
      popup()?.querySelector('[data-slot="schedule-detail"]'),
    ).not.toBeNull()
    await expect(
      screen.queryByRole('list', { name: 'Atalhos de data' }),
    ).toBeNull()
    await expect(
      body.getByRole('combobox', { name: /^Frequência/ }),
    ).toBeInTheDocument()
    await expect(body.getByRole('button', { name: 'Voltar' })).toHaveFocus()

    await userEvent.click(body.getByRole('button', { name: 'Voltar' }))
    await expect(
      popup()?.querySelector('[data-slot="schedule-detail"]'),
    ).toBeNull()
    await expect(
      screen.getByRole('list', { name: 'Atalhos de data' }),
    ).toBeInTheDocument()
    await expect(body.getByRole('button', { name: 'Repetir' })).toHaveFocus()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DrillInEditsAndClosesOnPick: Story = {
  args: { footerLayout: 'drill-in' },
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)

    await userEvent.click(body.getByRole('button', { name: 'Hora' }))
    await userEvent.click(body.getByRole('switch', { name: 'Dia inteiro' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ allDay: true, endTime: '', startTime: '' }),
    )

    await userEvent.click(body.getByRole('button', { name: 'Voltar' }))
    await expect(body.getByRole('button', { name: 'Hora' })).toHaveTextContent(
      'Dia inteiro',
    )
    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))
    await waitFor(() => expect(popup()).toBeNull())
  },
}
