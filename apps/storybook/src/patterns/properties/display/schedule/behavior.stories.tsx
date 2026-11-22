import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  emptyScheduleValue,
  ScheduleProperty,
  type ScheduleValue,
} from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { esperarSuperficieDeBadge } from '../../../../test-utils/property-surface'
import { ScheduleCanvas } from './schedule-canvas.tsx'
import { scheduleToday, timedWeeklySchedule } from './schedule-data.ts'
import { StatefulSchedule } from './schedule-layouts.tsx'

const october26 = new Date(2026, 9, 26)

const meta = {
  args: {
    ariaLabel: 'Data',
    calendarLocale: ptBR,
    onOpenChange: fn(),
    onValueChange: fn((_value: ScheduleValue) => {}),
    today: scheduleToday,
    value: timedWeeklySchedule,
  },
  component: ScheduleProperty,
  decorators: [ScheduleCanvas],
  render: (args) => <StatefulSchedule {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Schedule/Behavior',
} satisfies Meta<typeof ScheduleProperty>

export default meta

type Story = StoryObj<typeof meta>

const popup = () =>
  document.querySelector<HTMLElement>('[data-slot="schedule-popup"]')

const popupFrame = () => {
  const frame = document.querySelector<HTMLElement>(
    '[data-slot="popover-popup"]',
  )
  if (!frame) throw new Error('The schedule popup frame did not mount.')
  return frame
}

async function openPopup(canvasElement: HTMLElement, trigger = /^Data:/) {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: trigger }),
  )

  return waitFor(() => {
    const opened = popup()
    if (!opened || popupFrame().hasAttribute('data-starting-style'))
      throw new Error('The schedule popup did not open.')
    return within(opened)
  })
}

const popupClosed = () => waitFor(() => expect(popup()).toBeNull())

const closePopup = async () => {
  await userEvent.keyboard('{Escape}')
  await popupClosed()
}

const presets = () =>
  within(screen.getByRole('list', { name: 'Atalhos de data' }))

const shortWindow = {
  globals: { viewport: { isRotated: false, value: 'shortWindow' } },
  parameters: {
    viewport: {
      options: {
        shortWindow: {
          name: 'Short window',
          styles: { height: '600px', width: '1270px' },
        },
      },
    },
  },
}

async function expectPopupInsideWindow() {
  await waitFor(() => {
    const frame = popupFrame()
    const { bottom, top } = frame.getBoundingClientRect()
    expect(frame).not.toHaveAttribute('data-starting-style')
    expect(top).toBeGreaterThanOrEqual(0)
    expect(bottom).toBeLessThanOrEqual(window.innerHeight)
  })
}

async function expectLastControlReachable(body: ReturnType<typeof within>) {
  const allDay = body.getByRole('switch', { name: 'Dia inteiro' })
  allDay.scrollIntoView({ block: 'end' })
  const frame = popupFrame().getBoundingClientRect()
  const control = allDay.getBoundingClientRect()
  await expect(control.top).toBeGreaterThanOrEqual(frame.top)
  await expect(control.bottom).toBeLessThanOrEqual(frame.bottom)
}

export const NameCarriesRecurrence: Story = {
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Data: 26 de out · 14:00 – 16:00 · Semanalmente',
    })

    await expect(trigger).toHaveTextContent(/^26 de out · 14:00 – 16:00$/)
    await expect(trigger.querySelector('.lucide-repeat')).not.toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const WithoutHandlerIsLabelledImage: Story = {
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
    ).toBeVisible()
  },
}

export const ReadOnlyWinsOverHandler: Story = {
  args: { readOnly: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await esperarSuperficieDeBadge(canvasElement)
    await expect(canvas.queryByRole('button')).toBeNull()
    await expect(
      canvas.getByRole('img', {
        name: 'Data: 26 de out · 14:00 – 16:00 · Semanalmente',
      }),
    ).toBeVisible()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const EmptyShowsFallback: Story = {
  args: {
    ariaLabel: 'Prazo',
    fallback: 'Sem prazo',
    value: emptyScheduleValue,
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Prazo: Sem prazo' }),
    ).toHaveAttribute('data-empty', 'true')
  },
}

export const PopupIsNamedDialogWithoutViewport: Story = {
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await expect(screen.getByRole('dialog', { name: 'Data' })).toBe(
      popupFrame(),
    )
    await expect(
      document.querySelector('[data-slot="popover-viewport"]'),
    ).toBeNull()
    await closePopup()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const OnOpenChangeReportsOpen: Story = {
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true)

    await closePopup()
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2)
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}

export const KeyboardOpensAndCloses: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /^Data:/,
    })

    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(popup()).not.toBeNull())
    await waitFor(() =>
      expect(popupFrame().contains(document.activeElement)).toBe(true),
    )

    await closePopup()
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const PresetEmitsDayAndCloses: Story = {
  args: { value: emptyScheduleValue },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Data: Sem data' }),
    ).toHaveAttribute('data-empty', 'true')

    await openPopup(canvasElement)
    await expect(presets().getAllByRole('button')).toHaveLength(5)
    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ from: new Date(2026, 9, 8) }),
    )
    await popupClosed()
    await expect(
      canvas.getByRole('button', { name: 'Data: 8 de out' }),
    ).toBeVisible()
  },
}

export const PickingCurrentDayClosesWithoutEmitting: Story = {
  args: { value: { ...emptyScheduleValue, from: scheduleToday } },
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await popupClosed()
  },
}

export const ClearingDayClearsRecurrenceAndReminders: Story = {
  play: async ({ args, canvasElement }) => {
    await openPopup(canvasElement)

    await userEvent.click(presets().getByRole('button', { name: 'Sem data' }))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        frequency: null,
        from: null,
        reminders: [],
        until: null,
      }),
    )
    await popupClosed()
  },
}

export const RowsStartClosedWithTheirValues: Story = {
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)

    const rows = Array.from(
      (popup() as HTMLElement).querySelectorAll<HTMLElement>(
        '[data-slot="schedule-section-row"]',
      ),
    )
    await expect(rows.map((row) => row.textContent)).toEqual([
      'Hora14:00 – 16:00',
      'RepetirSemanalmente · Até 18 de dez.',
      'Lembretes30 min antes +1',
    ])
    for (const row of rows) {
      await expect(row).toHaveAttribute('aria-expanded', 'false')
    }
    await expect(
      body.getByRole('button', { name: 'Hora' }),
    ).toHaveAccessibleDescription('14:00 – 16:00')
    await expect(
      body.getByRole('button', { name: 'Repetir' }),
    ).toHaveAccessibleDescription('Semanalmente · Até 18 de dez.')
    await expect(body.queryByRole('switch', { name: 'Dia inteiro' })).toBeNull()

    await closePopup()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const RowsExpandOneAtATime: Story = {
  play: async ({ args, canvasElement }) => {
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
      within(body.getByRole('group', { name: 'Repetir' })).getByRole(
        'combobox',
        { name: /^Frequência/ },
      ),
    ).toBeInTheDocument()

    await userEvent.click(repeat)
    await expect(repeat).toHaveAttribute('aria-expanded', 'false')
    await expect(body.queryByRole('group', { name: 'Repetir' })).toBeNull()

    await closePopup()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const TimeSectionShowsStoredTimes: Story = {
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))

    await expect(
      body.getByRole('switch', { name: 'Dia inteiro' }),
    ).not.toBeChecked()
    await expect(
      body.getByRole('combobox', { name: 'Início' }),
    ).toHaveTextContent('14:00')
    await expect(body.getByRole('combobox', { name: 'Fim' })).toHaveTextContent(
      '16:00',
    )

    await closePopup()
  },
}

export const StaysOpenWhileSectionIsOpen: Story = {
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))

    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ from: new Date(2026, 9, 8) }),
    )
    await expect(popup()).not.toBeNull()
    await expect(
      within(canvasElement).getByRole('button', { name: /^Data:/ }),
    ).toHaveTextContent('8 de out · 14:00 – 16:00')

    await closePopup()
  },
}

export const ClosesOnPickOnceSectionCloses: Story = {
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    const reminders = body.getByRole('button', { name: 'Lembretes' })

    await userEvent.click(reminders)
    await userEvent.click(presets().getByRole('button', { name: /^Amanhã/ }))
    await expect(popup()).not.toBeNull()

    await userEvent.click(reminders)
    await userEvent.click(presets().getByRole('button', { name: /^Hoje/ }))
    await popupClosed()
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
  },
}

export const AllDayClearsTimes: Story = {
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))

    const allDay = body.getByRole('switch', { name: 'Dia inteiro' })
    await expect(allDay).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(allDay)

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ allDay: true, endTime: '', startTime: '' }),
    )
    await expect(body.getByRole('combobox', { name: 'Início' })).toBeDisabled()

    await closePopup()
  },
}

export const RowsDisabledWithoutDay: Story = {
  args: { value: emptyScheduleValue },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)
    const reminders = body.getByRole('button', { name: 'Lembretes' })

    await expect(body.getByRole('button', { name: 'Repetir' })).toBeDisabled()
    await expect(reminders).toBeDisabled()
    await expect(reminders.textContent).toBe('LembretesAdicionar lembrete')
    await expect(body.getByRole('button', { name: 'Hora' })).toBeEnabled()

    await closePopup()
  },
}

export const RecurrenceEnabledWithoutDay: Story = {
  args: { recurrenceEnabled: true, value: emptyScheduleValue },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Repetir' })).toBeEnabled()
    await expect(body.getByRole('button', { name: 'Lembretes' })).toBeDisabled()

    await closePopup()
  },
}

export const RemindersEnabledWithoutDay: Story = {
  args: { remindersEnabled: true, value: emptyScheduleValue },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.getByRole('button', { name: 'Lembretes' })).toBeEnabled()
    await expect(body.getByRole('button', { name: 'Repetir' })).toBeDisabled()

    await closePopup()
  },
}

export const RemindersFollowOptionOrder: Story = {
  args: {
    value: {
      ...emptyScheduleValue,
      from: october26,
      reminders: ['1440', '30'],
    },
  },
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    const reminders = body.getByRole('button', { name: 'Lembretes' })
    const chipNames = () =>
      body
        .getAllByRole('button', { name: /^Remover lembrete/ })
        .map((chip) => chip.getAttribute('aria-label'))

    await expect(reminders).toHaveAttribute('aria-expanded', 'false')
    await expect(
      body.queryByRole('button', { name: /^Remover lembrete/ }),
    ).toBeNull()
    await userEvent.click(reminders)
    await expect(reminders).toHaveAttribute('aria-expanded', 'true')
    await expect(chipNames()).toEqual([
      'Remover lembrete 30 min antes',
      'Remover lembrete 1 dia antes',
    ])

    await userEvent.click(
      body.getByRole('button', { name: 'Adicionar lembrete' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: '1 hora antes' }),
    )

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ reminders: ['30', '60', '1440'] }),
    )
    await expect(chipNames()).toEqual([
      'Remover lembrete 30 min antes',
      'Remover lembrete 1 hora antes',
      'Remover lembrete 1 dia antes',
    ])

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
    await closePopup()
  },
}

export const TimeInputUsesNativeField: Story = {
  args: { timeControl: 'input' },
  play: async ({ args, canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))

    await expect(body.getByLabelText('Início')).toHaveValue('14:00')
    await expect(body.getByLabelText('Fim')).toHaveValue('16:00')
    await expect(body.queryByRole('combobox', { name: 'Início' })).toBeNull()

    await userEvent.clear(body.getByLabelText('Início'))
    await userEvent.type(body.getByLabelText('Início'), '09:30')
    await expect(body.getByLabelText('Início')).toHaveValue('09:30')
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ startTime: '09:30' }),
    )

    await closePopup()
  },
}

export const DateOnlyDropsFooter: Story = {
  args: { dateOnly: true },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)

    await expect(body.queryByRole('button', { name: 'Hora' })).toBeNull()
    await expect(body.queryByRole('button', { name: 'Repetir' })).toBeNull()
    await expect(body.queryByRole('button', { name: 'Lembretes' })).toBeNull()
    await expect(
      popup()?.querySelector('[data-slot="schedule-sections"]'),
    ).toBeNull()

    await closePopup()
  },
}

export const CalendarPropsReachCalendar: Story = {
  args: { calendarProps: { disabled: { before: scheduleToday } } },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)
    await expect(
      body.getByRole('button', { name: 'terça-feira, 6 de outubro de 2026' }),
    ).toBeDisabled()
    await expect(
      body.getByRole('button', { name: 'quinta-feira, 8 de outubro de 2026' }),
    ).toBeEnabled()

    await closePopup()
  },
}

export const CalendarLocaleReachesEveryCalendar: Story = {
  args: { locale: 'pt-BR' },
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)
    await expect(body.getByText('outubro 2026')).toBeInTheDocument()
    await expect(
      within(body.getByRole('grid')).getByText('seg'),
    ).toBeInTheDocument()

    await userEvent.click(body.getByRole('button', { name: 'Repetir' }))
    await userEvent.click(body.getByRole('button', { name: /^Até:/ }))
    await expect(await screen.findByText('dezembro 2026')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByText('dezembro 2026')).not.toBeInTheDocument(),
    )

    await closePopup()
  },
}

export const LabelsAndLocaleReplaceCopy: Story = {
  args: {
    ariaLabel: 'Date',
    calendarLocale: undefined,
    labels: {
      addReminder: 'Add reminder',
      allDay: 'All day',
      back: 'Back',
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
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Date: Oct 26 · 14:00 – 16:00 · Weekly',
      }),
    ).toBeVisible()

    const body = await openPopup(canvasElement, /^Date:/)
    const englishPresets = within(
      screen.getByRole('list', { name: 'Date presets' }),
    )
    await expect(
      englishPresets.getByRole('button', { name: /^Next week/ }),
    ).toHaveTextContent('Mon, Oct 12')
    await expect(
      englishPresets.getByRole('button', { name: 'No date' }),
    ).toBeInTheDocument()
    await expect(body.getByText('October 2026')).toBeInTheDocument()
    await expect(
      body.getByRole('button', { name: 'Reminders' }),
    ).toHaveAccessibleDescription('30 min before +1')

    await closePopup()
  },
}

export const ShortWindowScrollsInside: Story = {
  globals: shortWindow.globals,
  parameters: shortWindow.parameters,
  play: async ({ canvasElement }) => {
    const body = await openPopup(canvasElement)
    await userEvent.click(body.getByRole('button', { name: 'Hora' }))
    const scroller = popupFrame().firstElementChild as HTMLElement

    await expectPopupInsideWindow()
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
    await expectLastControlReachable(body)

    await closePopup()
  },
}

export const CollisionAvoidanceKeepsBelowTrigger: Story = {
  args: { dropdownPlacement: { collisionAvoidance: { side: 'none' } } },
  globals: shortWindow.globals,
  parameters: shortWindow.parameters,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: /^Data:/,
    })
    const body = await openPopup(canvasElement)
    await expect(popupFrame()).toHaveAttribute('data-side', 'bottom')
    await expect(popupFrame().getBoundingClientRect().top).toBeGreaterThan(
      trigger.getBoundingClientRect().bottom,
    )

    await userEvent.click(body.getByRole('button', { name: 'Hora' }))
    await expectPopupInsideWindow()
    await expect(popupFrame()).toHaveAttribute('data-side', 'bottom')
    await expectLastControlReachable(body)

    await closePopup()
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
    ).toBeVisible()
    await expect(body.getByRole('button', { name: 'Repetir' })).toHaveFocus()
    await expect(args.onValueChange).not.toHaveBeenCalled()

    await closePopup()
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
    await popupClosed()
    await expect(args.onValueChange).toHaveBeenCalledTimes(2)
  },
}
