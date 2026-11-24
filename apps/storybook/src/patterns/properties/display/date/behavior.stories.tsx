import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty } from '@tc96/ui/patterns'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { DateCanvas } from './date-canvas.tsx'

const VALUE = '2026-06-19T12:00:00.000Z'

const meta = {
  args: { locale: 'en-US', timeZone: 'UTC', value: VALUE },
  component: DateProperty,
  decorators: [DateCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Behavior',
} satisfies Meta<typeof DateProperty>

export default meta

type Story = StoryObj<typeof meta>

const surfaceOf = (canvasElement: HTMLElement, text: string) =>
  within(canvasElement)
    .getByText(text)
    .closest<HTMLElement>('button, [data-slot="property-surface"]')

const dayButton = (grid: HTMLElement, day: string) => {
  const button = within(grid)
    .getAllByRole('gridcell')
    .find((cell) => cell.textContent === day)
    ?.querySelector('button')
  if (!button) throw new Error(`The calendar did not render day ${day}.`)
  return button
}

const closeCalendar = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
}

const tooltipText = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
    ?.textContent

export const WithoutHandlerIsReadOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Jun 19')).toBeVisible()
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

export const ReadOnlyBadge: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Jun 19')).toBeInTheDocument()
    await expect(
      canvas.queryByRole('button', { name: 'Date: Jun 19' }),
    ).toBeNull()
  },
}

export const ReadOnlyWinsOverHandler: Story = {
  args: { onValueChange: fn(), readOnly: true },
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const BadgeIsFilled: Story = {
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainWithoutBadge: Story = {
  args: { readOnly: true, variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Jun 19')).toBeInTheDocument()
    await esperarSuperficiePlana(canvasElement)
  },
}

export const PlainTriggerOpensCalendar: Story = {
  args: { ariaLabel: 'Target date', onValueChange: fn(), variant: 'plain' },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Target date: Jun 19',
    })

    await expect(trigger).toHaveAttribute('data-variant', 'plain')
    await expect(getComputedStyle(trigger).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    )
    await userEvent.click(trigger)
    await expect(await screen.findByRole('grid')).toBeInTheDocument()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const OpensCalendarAndClears: Story = {
  args: { fallback: 'No target', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await expect(await screen.findByRole('grid')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Limpar data' }))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null)
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const WithoutAllowClearNoClearButton: Story = {
  args: { allowClear: false, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await screen.findByRole('grid')

    await expect(
      screen.queryByRole('button', { name: 'Limpar data' }),
    ).toBeNull()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ActionGetsSerializedDateAndPreviousValue: Story = {
  args: {
    action: fn(),
    serializeDate: (date: Date) => date.toISOString(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '20'))

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.action).toHaveBeenLastCalledWith(
      new Date(2026, 5, 20).toISOString(),
      expect.objectContaining({ previousValue: VALUE }),
    )
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const PicksNoonUtcOfTheDay: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '20'))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      '2026-06-20T12:00:00.000Z',
    )
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const ActionWinsOverOnValueChange: Story = {
  args: { action: fn(), onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '20'))

    await expect(args.action).toHaveBeenCalledOnce()
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
  },
}

export const PickingCurrentDayEmitsNothing: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Date: Jun 19' }),
    )
    await userEvent.click(dayButton(await screen.findByRole('grid'), '19'))

    await expect(args.onValueChange).not.toHaveBeenCalled()
    await closeCalendar()
  },
}

export const DisabledDoesNotOpen: Story = {
  args: { disabled: true, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Date: Jun 19',
    })

    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })

    await expect(screen.queryByRole('grid')).toBeNull()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const CalendarLocaleTranslatesGrid: Story = {
  args: {
    ariaLabel: 'Prazo',
    calendarLocale: ptBR,
    locale: 'pt-BR',
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    const grid = await screen.findByRole('grid')

    await expect(await screen.findByText('junho 2026')).toBeInTheDocument()
    await expect(within(grid).getByText('seg')).toBeInTheDocument()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const EmptyReadOnlyIsOutlineBadge: Story = {
  args: { locale: undefined, readOnly: true, timeZone: undefined, value: null },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Sem data')

    await expect(surface?.getAttribute('data-empty')).toBe('true')
    await expect(surface?.className).toContain('border-input')
  },
}

export const EmptyEditableIsOutlineBadge: Story = {
  args: {
    locale: undefined,
    onValueChange: fn(),
    timeZone: undefined,
    value: null,
  },
  play: async ({ args, canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Sem data')

    await expect(surface?.getAttribute('data-empty')).toBe('true')
    await expect(surface?.className).toContain('border-input')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const FilledEditableIsNotEmpty: Story = {
  args: { onValueChange: fn(), timeZone: undefined },
  play: async ({ args, canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByText('Jun 19')
        .closest('button')
        ?.getAttribute('data-empty'),
    ).toBe(null)
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

const TIMESTAMP = '2026-11-13T17:07:00.000Z'
const FULL_DATE = '13 de novembro de 2026 às 14:07'

const tooltipArgs = {
  displayLabel: 'há 53 minutos',
  locale: 'pt-BR',
  timeZone: 'America/Sao_Paulo',
  tooltip: true,
  value: TIMESTAMP,
}

export const TooltipShowsFullDateOnFocus: Story = {
  args: { ...tooltipArgs, readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'há 53 minutos') as HTMLElement

    await userEvent.tab()

    await expect(surface).toHaveFocus()
    await waitFor(() => expect(tooltipText(canvasElement)).toBe(FULL_DATE))
    await expect(surface).toHaveAccessibleDescription(FULL_DATE)

    await userEvent.tab()
    await waitFor(() => expect(tooltipText(canvasElement)).toBeUndefined())
  },
}

export const TooltipShowsFullDateOnHover: Story = {
  args: { ...tooltipArgs, readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'há 53 minutos') as HTMLElement

    await userEvent.hover(surface)
    await waitFor(() => expect(tooltipText(canvasElement)).toBe(FULL_DATE))

    await userEvent.unhover(surface)
    await waitFor(() => expect(tooltipText(canvasElement)).toBeUndefined())
  },
}

export const EditableTooltipKeepsCalendar: Story = {
  args: { ...tooltipArgs, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Date: há 53 minutos',
    })

    await expect(trigger).toHaveAccessibleDescription(FULL_DATE)
    await userEvent.hover(trigger)
    await waitFor(() => expect(tooltipText(canvasElement)).toBe(FULL_DATE))

    await userEvent.click(trigger)
    await expect(await screen.findByRole('grid')).toBeInTheDocument()
    await closeCalendar()
    await userEvent.unhover(trigger)
    await waitFor(() => expect(tooltipText(canvasElement)).toBeUndefined())
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const WithoutTooltipNoTabStop: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Jun 19')

    await expect(surface).not.toHaveAttribute('tabindex')
    await expect(surface).not.toHaveAttribute('aria-describedby')
  },
}

export const TooltipWithoutValueNoTabStop: Story = {
  args: { readOnly: true, tooltip: true, value: null },
  play: async ({ canvasElement }) => {
    await expect(surfaceOf(canvasElement, 'Sem data')).not.toHaveAttribute(
      'tabindex',
    )
  },
}

const OVERDUE_TEXT = '14 nov · venceu'

const overdueArgs = {
  ariaLabel: 'Vencimento',
  displayLabel: OVERDUE_TEXT,
  isOverdue: true,
  locale: 'pt-BR',
  value: '2026-11-14T12:00:00.000Z',
}

export const OverdueDisplayLabelOnTrigger: Story = {
  args: { ...overdueArgs, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: `Vencimento: ${OVERDUE_TEXT}`,
    })

    await expect(trigger).toHaveTextContent(OVERDUE_TEXT)
    await expect(trigger).toHaveAttribute('data-overdue')
    await expect(trigger.className).toContain('font-medium')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const OverdueDisplayLabelOnReadOnlyValue: Story = {
  args: { ...overdueArgs, readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, OVERDUE_TEXT)

    await expect(within(canvasElement).queryByRole('button')).toBeNull()
    await expect(surface).toHaveAttribute('data-overdue')
    await expect(surface?.className).toContain('font-medium')
  },
}

export const OverdueDisplayLabelOnTooltipValue: Story = {
  args: { ...overdueArgs, readOnly: true, tooltip: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, OVERDUE_TEXT)

    await expect(surface).toHaveAttribute('tabindex', '0')
    await expect(surface).toHaveAttribute('data-overdue')
    await expect(surface?.className).toContain('font-medium')
  },
}

export const OverdueAddsNoWord: Story = {
  args: { isOverdue: true, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Date: Jun 19',
    })

    await expect(trigger).toHaveTextContent(/^Jun 19$/)
    await expect(trigger).toHaveAttribute('data-overdue')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const OverdueReadOnlyAddsNoWord: Story = {
  args: { isOverdue: true, readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Jun 19')

    await expect(surface).toHaveTextContent(/^Jun 19$/)
    await expect(surface).toHaveAttribute('data-overdue')
  },
}

export const NotOverdueHasNoAttribute: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Date: Jun 19',
    })

    await expect(trigger).not.toHaveAttribute('data-overdue')
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const NotOverdueReadOnlyHasNoAttribute: Story = {
  args: { readOnly: true, tooltip: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Jun 19')

    await expect(surface).not.toHaveAttribute('data-overdue')
  },
}
