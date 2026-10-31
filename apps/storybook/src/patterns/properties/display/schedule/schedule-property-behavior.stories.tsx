import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  emptyScheduleValue,
  ScheduleProperty,
  type ScheduleValue,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const today = new Date(2026, 9, 7)
const october26 = new Date(2026, 9, 26)

const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

const popup = () =>
  document.querySelector<HTMLElement>('[data-slot="schedule-popup"]')

async function openPopup(canvasElement: HTMLElement, trigger = /^Data:/) {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: trigger }),
  )

  return waitFor(() => {
    const opened = popup()
    if (!opened || opened.hasAttribute('data-starting-style'))
      throw new Error('The schedule popup did not open.')
    return within(opened)
  })
}

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

const popupClosed = () => waitFor(() => expect(popup()).toBeNull())

const meta = {
  args: {
    ariaLabel: 'Data',
    onValueChange: fn((_value: ScheduleValue) => {}),
    today,
    value: emptyScheduleValue,
  },
  component: ScheduleProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-176 items-start p-4">
        <Story />
      </div>
    ),
  ],
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
  title: 'Patterns/Properties/Display/Schedule/Behavior',
} satisfies Meta<typeof ScheduleProperty>

export default meta

type Story = StoryObj<typeof meta>

export const LabelledSurfaceWithoutHandler: Story = {
  args: {
    value: { ...emptyScheduleValue, frequency: 'weekly', from: october26 },
  },
  render: ({ onValueChange: _onValueChange, ...args }) => (
    <ScheduleProperty {...args} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('img', { name: 'Data: 26 de out · Semanalmente' }),
    ).toBeInTheDocument()
  },
}

export const EmptyFallsBackToAbsenceTone: Story = {
  args: { ariaLabel: 'Prazo', fallback: 'Sem prazo' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: Sem prazo' }),
    ).toHaveAttribute('data-empty', 'true')
  },
}

export const PresetEmitsDayAndCloses: Story = {
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await expect(presets().getAllByRole('button')).toHaveLength(5)
    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: new Date(2026, 9, 8) }),
    )
    await popupClosed()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Data: 8 de out' }),
    ).toBeInTheDocument()
  },
}

export const StaysOpenWhileTimeSectionIsOpen: Story = {
  args: { value: { ...emptyScheduleValue, from: october26 } },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    const time = body.getByRole('button', { name: 'Hora' })
    await expect(time).toHaveAttribute('aria-expanded', 'false')
    await expect(body.queryByRole('switch', { name: 'Dia inteiro' })).toBeNull()
    await userEvent.click(time)
    await expect(time).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))

    await expect(popup()).not.toBeNull()
    await expect(
      within(canvasElement).getByRole('button', { name: 'Data: 7 de out' }),
    ).toBeInTheDocument()
  },
}

export const AllDayClearsTimes: Story = {
  args: {
    value: {
      ...emptyScheduleValue,
      allDay: false,
      endTime: '16:00',
      from: october26,
      startTime: '14:00',
    },
  },
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))

    const allDay = body.getByRole('switch', { name: 'Dia inteiro' })
    await expect(allDay).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(allDay)

    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ allDay: true, endTime: '', startTime: '' }),
    )
  },
}

export const ClearingDayClearsRecurrenceAndReminders: Story = {
  args: {
    value: {
      ...emptyScheduleValue,
      frequency: 'weekly',
      from: october26,
      reminders: ['30'],
      until: '2026-12-18T12:00:00.000Z',
    },
  },
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await userEvent.click(presets().getByRole('button', { name: 'Sem data' }))

    await expect(args.onValueChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        frequency: null,
        from: null,
        reminders: [],
        until: null,
      }),
    )
  },
}

export const PickingCurrentDayClosesWithoutEmitting: Story = {
  args: { value: { ...emptyScheduleValue, from: today } },
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await popupClosed()
  },
}

export const RemindersInOptionOrderKeepPopupOpen: Story = {
  args: {
    value: {
      ...emptyScheduleValue,
      from: october26,
      reminders: ['1440', '30'],
    },
  },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    const reminders = body.getByRole('button', { name: 'Lembretes' })
    await expect(reminders).toHaveAttribute('aria-expanded', 'false')
    await expect(
      body.queryByRole('button', { name: /^Remover lembrete/ }),
    ).toBeNull()
    await userEvent.click(reminders)

    await expect(
      body
        .getAllByRole('button', { name: /^Remover lembrete/ })
        .map((chip) => chip.getAttribute('aria-label')),
    ).toEqual(['Remover lembrete 30 min antes', 'Remover lembrete 1 dia antes'])

    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))
    await expect(popup()).not.toBeNull()
  },
}

export const RemindersDisabledWithoutAnchor: Story = {
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Lembretes' })).toBeDisabled()
  },
}

export const RemindersEnabledByConsumer: Story = {
  args: { remindersEnabled: true },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Lembretes' })).toBeEnabled()
  },
}

export const RecurrenceDisabledWithoutAnchor: Story = {
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Repetir' })).toBeDisabled()
  },
}

export const RecurrenceEnabledByConsumer: Story = {
  args: { recurrenceEnabled: true },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Repetir' })).toBeEnabled()
  },
}

export const DateOnlyDropsFooter: Story = {
  args: { dateOnly: true },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.queryByRole('button', { name: 'Hora' })).toBeNull()
    await expect(body.queryByRole('button', { name: 'Repetir' })).toBeNull()
    await expect(body.queryByRole('button', { name: 'Lembretes' })).toBeNull()
  },
}

export const PopupWithoutCossViewport: Story = {
  args: { value: { ...emptyScheduleValue, from: october26 } },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement)

    await expect(
      screen.getByRole('dialog', { name: 'Data' }),
    ).toBeInTheDocument()
    await expect(
      document.querySelector('[data-slot="popover-popup"]'),
    ).not.toBeNull()
    await expect(
      document.querySelector('[data-slot="popover-viewport"]'),
    ).toBeNull()
  },
}

export const CollisionAvoidanceOpensBelowTrigger: Story = {
  args: {
    dropdownPlacement: { collisionAvoidance: { side: 'none' } },
    value: { ...emptyScheduleValue, from: october26 },
  },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement)

    await expect(
      document.querySelector('[data-slot="popover-popup"]'),
    ).toHaveAttribute('data-side', 'bottom')
  },
}

export const LabelsReplaceCopy: Story = {
  args: { labels: { noDate: 'No date', today: 'Today' } },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    await openPopup(canvasElement)

    await expect(
      within(canvasElement).getByRole('button', { name: 'Data: No date' }),
    ).toBeInTheDocument()
    await expect(
      presets().getByRole('button', { name: /^Today/ }),
    ).toBeInTheDocument()
  },
}
