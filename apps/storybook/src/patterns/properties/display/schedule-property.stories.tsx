import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  emptyScheduleValue,
  ScheduleProperty,
  type SchedulePropertyProps,
  type ScheduleValue,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { esperarSuperficieDeBadge } from '../../../test-utils/property-surface'
import {
  booleanArgType,
  propertyVariantArgType,
} from '../../../test-utils/story-arg-types'

const storyToday = new Date(2026, 9, 7)

const scheduledValue: ScheduleValue = {
  allDay: false,
  endTime: '16:00',
  frequency: 'weekly',
  from: new Date(2026, 9, 26),
  reminders: ['30', '1440'],
  startTime: '14:00',
  until: '2026-12-18T12:00:00.000Z',
}

function ScheduleStory({
  onValueChange,
  value: initialValue,
  ...props
}: Readonly<SchedulePropertyProps>) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="flex min-h-176 items-start p-4">
      <ScheduleProperty
        {...props}
        onValueChange={
          onValueChange &&
          ((next) => {
            setValue(next)
            onValueChange(next)
          })
        }
        value={value}
      />
    </div>
  )
}

// COSS calendar weekday and outside-month text is 3.14:1 (below 4.5:1); COSS stays unmodified, so only the contrast check is off.
const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

async function openPopup(canvasElement: HTMLElement, trigger: RegExp) {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: trigger }),
  )

  return waitFor(() => {
    const popup = document.querySelector<HTMLElement>(
      '[data-slot="schedule-popup"]',
    )
    if (!popup) throw new Error('The schedule popup did not open.')
    return within(popup)
  })
}

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

const meta = {
  args: {
    ariaLabel: 'Data',
    calendarProps: { locale: ptBR },
    onValueChange: fn(),
    today: storyToday,
    value: scheduledValue,
  },
  argTypes: {
    ...propertyVariantArgType,
    calendarProps: { control: false },
    dateOnly: booleanArgType,
    readOnly: booleanArgType,
    recurrenceEnabled: booleanArgType,
    remindersEnabled: booleanArgType,
    timeControl: { control: 'inline-radio', options: ['select', 'input'] },
    today: { control: false },
    value: { control: false },
  },
  component: ScheduleProperty,
  parameters: {
    docs: {
      description: {
        component:
          'When something happens: one day, optional start and end times, a recurrence and reminders. The trigger opens one dropdown with presets (today, tomorrow, this weekend, next week, no date) carrying their weekday on the right, a calendar, and a footer whose **Hora**, **Repetir** and **Lembretes** open sections inside the dropdown. Picking a day closes the dropdown unless one of those sections is open, because then the user is not done. All three start closed even with a stored value. Copy defaults to pt-BR and is replaced through `labels`; the calendar language comes from `calendarProps.locale`, as in `DateRangeProperty`.',
      },
    },
  },
  render: (args) => <ScheduleStory {...args} />,
  title: 'Patterns/Properties/Display/Schedule',
} satisfies Meta<typeof ScheduleProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'A timed, weekly value. The recurrence shows as a glyph on the surface and in full in the accessible name. With **Hora** open, a preset changes the day and keeps the dropdown open.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', {
        name: 'Data: 26 de out · 14:00 – 16:00 · Semanalmente',
      }),
    ).toHaveTextContent('26 de out · 14:00 – 16:00')

    const popup = await openPopup(canvasElement, /^Data:/)
    await expect(presets().getAllByRole('button')).toHaveLength(5)

    const time = popup.getByRole('button', { name: 'Hora' })
    await expect(time).toHaveAttribute('aria-pressed', 'false')
    await expect(
      popup.queryByRole('switch', { name: 'Dia inteiro' }),
    ).not.toBeInTheDocument()

    await userEvent.click(time)
    await expect(
      popup.getByRole('switch', { name: 'Dia inteiro' }),
    ).not.toBeChecked()
    await expect(
      popup.getByRole('combobox', { name: 'Início' }),
    ).toHaveTextContent('14:00')
    await expect(
      popup.getByRole('combobox', { name: 'Fim' }),
    ).toHaveTextContent('16:00')

    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))
    await expect(args.onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ from: new Date(2026, 9, 8) }),
    )
    await expect(
      canvas.getByRole('button', { name: /^Data:/ }),
    ).toHaveTextContent('8 de out · 14:00 – 16:00')
    await expect(
      document.querySelector('[data-slot="schedule-popup"]'),
    ).not.toBeNull()
  },
}

export const Reminders: Story = {
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          '**Lembretes** opens the reminders as chips with an add button. They follow the order of `reminderOptions`, whatever order they were picked in, so the consumer lists the options from the closest to the farthest.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const popup = await openPopup(canvasElement, /^Data:/)
    const reminders = popup.getByRole('button', { name: 'Lembretes' })
    await expect(reminders).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(reminders)
    await expect(reminders).toHaveAttribute('aria-pressed', 'true')
    const chipNames = () =>
      popup
        .getAllByRole('button', { name: /^Remover lembrete/ })
        .map((chip) => chip.getAttribute('aria-label'))
    await expect(chipNames()).toEqual([
      'Remover lembrete 30 min antes',
      'Remover lembrete 1 dia antes',
    ])

    await userEvent.click(
      popup.getByRole('button', { name: 'Adicionar lembrete' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: '1 hora antes' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ reminders: ['30', '60', '1440'] }),
    )
    await expect(chipNames()).toEqual([
      'Remover lembrete 30 min antes',
      'Remover lembrete 1 hora antes',
      'Remover lembrete 1 dia antes',
    ])
  },
}

export const Unscheduled: Story = {
  args: { value: emptyScheduleValue },
  parameters: {
    docs: {
      description: {
        story:
          'A new record: no day yet, so **Repetir** and **Lembretes** have no anchor and stay disabled. Picking a preset closes the dropdown, because setting the day was all there was to do.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Data: Sem data' }),
    ).toHaveAttribute('data-empty', 'true')

    const popup = await openPopup(canvasElement, /^Data:/)
    await expect(popup.getByRole('button', { name: 'Repetir' })).toBeDisabled()
    await expect(
      popup.getByRole('button', { name: 'Lembretes' }),
    ).toBeDisabled()

    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))
    await waitFor(() =>
      expect(document.querySelector('[data-slot="schedule-popup"]')).toBeNull(),
    )
    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(
      canvas.getByRole('button', { name: 'Data: 7 de out' }),
    ).toBeInTheDocument()
  },
}

export const TimeInput: Story = {
  args: { timeControl: 'input' },
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'The same dropdown with the native time field in an `InputGroup` instead of the 15-minute list. Typing is faster for someone who knows the time; the list is faster for someone choosing one.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement, /^Data:/)
    await userEvent.click(popup.getByRole('button', { name: 'Hora' }))

    await expect(popup.getByLabelText('Início')).toHaveValue('14:00')
    await expect(popup.getByLabelText('Fim')).toHaveValue('16:00')
    await expect(
      popup.queryByRole('combobox', { name: 'Início' }),
    ).not.toBeInTheDocument()

    await userEvent.clear(popup.getByLabelText('Início'))
    await userEvent.type(popup.getByLabelText('Início'), '09:30')
    await expect(popup.getByLabelText('Início')).toHaveValue('09:30')
  },
}

export const DateOnly: Story = {
  args: {
    ariaLabel: 'Prazo',
    dateOnly: true,
    fallback: 'Sem prazo',
    value: { ...emptyScheduleValue, from: new Date(2026, 9, 28) },
  },
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'The shape of a deadline: the same presets and calendar, without the time, recurrence and reminders footer.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement, /^Prazo:/)

    await expect(popup.queryByRole('button', { name: 'Hora' })).toBeNull()
    await expect(popup.queryByRole('button', { name: 'Repetir' })).toBeNull()
    await expect(popup.queryByRole('button', { name: 'Lembretes' })).toBeNull()
  },
}

export const NoPastDays: Story = {
  args: {
    calendarProps: { disabled: { before: storyToday }, locale: ptBR },
  },
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'Blocking past days is the consumer’s rule, passed as a DayPicker matcher in `calendarProps.disabled`. The presets never point backwards.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const popup = await openPopup(canvasElement, /^Data:/)

    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))
    await expect(
      popup.getByRole('button', { name: 'terça-feira, 6 de outubro de 2026' }),
    ).toBeDisabled()
    await expect(
      popup.getByRole('button', { name: 'quinta-feira, 8 de outubro de 2026' }),
    ).toBeEnabled()
  },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await esperarSuperficieDeBadge(canvasElement)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    await expect(
      canvas.getByRole('img', {
        name: 'Data: 26 de out · 14:00 – 16:00 · Semanalmente',
      }),
    ).toBeInTheDocument()
  },
}

export const EnglishLabels: Story = {
  args: {
    ariaLabel: 'Date',
    calendarProps: {},
    labels: {
      addReminder: 'Add reminder',
      allDay: 'All day',
      end: 'End',
      frequency: 'Frequency',
      nextWeek: 'Next week',
      noDate: 'No date',
      noReminders: 'No reminder found.',
      noRepeat: 'Does not repeat',
      presets: 'Date presets',
      reminders: 'Reminders',
      removeReminder: 'Remove reminder',
      repeat: 'Repeat',
      start: 'Start',
      thisWeekend: 'This weekend',
      time: 'Time',
      today: 'Today',
      tomorrow: 'Tomorrow',
      until: 'Until',
      untilFallback: 'No end',
    },
    locale: 'en-US',
    recurrenceOptions: [
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
    ],
    reminderOptions: [
      { label: '30 min before', value: '30' },
      { label: '1 day before', value: '1440' },
    ],
  },
  parameters: {
    ...cossCalendarContrast,
    docs: {
      description: {
        story:
          'Every string is a label with a pt-BR default. `locale` formats the surface and the preset hints; the calendar follows `calendarProps.locale` and is English without it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Date: Oct 26 · 14:00 – 16:00 · Weekly',
      }),
    ).toBeInTheDocument()

    await openPopup(canvasElement, /^Date:/)
    await expect(
      within(screen.getByRole('list', { name: 'Date presets' })).getByRole(
        'button',
        { name: /^Next week/ },
      ),
    ).toHaveTextContent('Mon, Oct 12')
  },
}
