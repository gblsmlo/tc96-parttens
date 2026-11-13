import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const VALUE = '2026-06-19T12:00:00.000Z'

const meta = {
  args: { locale: 'en-US', timeZone: 'UTC', value: VALUE },
  component: DateProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-96 items-start p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Date/Behavior',
} satisfies Meta<typeof DateProperty>

export default meta

type Story = StoryObj<typeof meta>

const surfaceOf = (canvasElement: HTMLElement, text: string) =>
  within(canvasElement)
    .getByText(text)
    .closest<HTMLElement>('button, [data-slot="property-surface"]')

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

export const PlainWithoutBadge: Story = {
  args: { readOnly: true, variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Jun 19')).toBeInTheDocument()
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

    await expect(args.onValueChange).toHaveBeenCalledTimes(1)
    await expect(args.onValueChange).toHaveBeenCalledWith(null)
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
    const grid = await screen.findByRole('grid')
    const day = within(grid)
      .getAllByRole('gridcell')
      .find((cell) => cell.textContent === '20')
      ?.querySelector('button')

    await expect(day).toBeTruthy()
    await userEvent.click(day as HTMLButtonElement)

    await expect(args.action).toHaveBeenCalledTimes(1)
    await expect(args.action).toHaveBeenCalledWith(
      new Date(2026, 5, 20).toISOString(),
      expect.objectContaining({ previousValue: VALUE }),
    )
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
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'Sem data')

    await expect(surface?.getAttribute('data-empty')).toBe('true')
    await expect(surface?.className).toContain('border-input')
  },
}

export const FilledEditableIsNotEmpty: Story = {
  args: { onValueChange: fn(), timeZone: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getByText('Jun 19')
        .closest('button')
        ?.getAttribute('data-empty'),
    ).toBe(null)
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

const tooltipText = (canvasElement: HTMLElement) =>
  canvasElement.ownerDocument.querySelector('[data-slot="tooltip-popup"]')
    ?.textContent

export const TooltipShowsFullDateOnFocus: Story = {
  args: { ...tooltipArgs, readOnly: true },
  play: async ({ canvasElement }) => {
    const surface = surfaceOf(canvasElement, 'há 53 minutos') as HTMLElement

    await userEvent.tab()

    await expect(surface).toHaveFocus()
    await waitFor(() => expect(tooltipText(canvasElement)).toBe(FULL_DATE))
    await expect(surface).toHaveAccessibleDescription(FULL_DATE)
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
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Date: há 53 minutos',
    })

    await expect(trigger).toHaveAccessibleDescription(FULL_DATE)
    await userEvent.hover(trigger)
    await waitFor(() => expect(tooltipText(canvasElement)).toBe(FULL_DATE))

    await userEvent.click(trigger)
    await expect(await screen.findByRole('grid')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull())
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
