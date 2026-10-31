import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateProperty } from '@tc96/parttens'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

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
