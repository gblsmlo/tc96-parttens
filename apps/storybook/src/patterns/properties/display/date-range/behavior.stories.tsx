import type { DateRange } from '@daypicker/react'
import { ptBR } from '@daypicker/react/locale'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeProperty } from '@tc96/ui/patterns'
import {
  expect,
  fn,
  type Mock,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import {
  esperarSuperficieDeBadge,
  esperarSuperficiePlana,
} from '../../../../test-utils/property-surface'
import { DateRangeCanvas } from './date-range-canvas.tsx'

const march = new Date(2026, 2, 2)
const april = new Date(2026, 3, 15)

const meta = {
  args: { locale: 'en-US', value: { from: march, to: april } },
  component: DateRangeProperty,
  decorators: [DateRangeCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/DateRange/Behavior',
} satisfies Meta<typeof DateRangeProperty>

export default meta

type Story = StoryObj<typeof meta>

const firstDayEleven = async () => {
  await screen.findAllByRole('grid')
  const cell = screen
    .getAllByRole('gridcell')
    .find((candidate) => candidate.textContent === '11')

  return cell?.querySelector('button') as HTMLButtonElement
}

const lastRange = (spy: unknown) =>
  (spy as Mock<(value: DateRange | undefined) => void>).mock.lastCall?.[0]

const positionerAlign = () =>
  document.querySelector<HTMLElement>('[data-slot="popover-positioner"]')
    ?.dataset.align

const closeCalendar = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryAllByRole('grid')).toHaveLength(0))
}

export const JoinsBothEnds: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Mar 2 – Apr 15'),
    ).toBeInTheDocument()
  },
}

export const BadgeIsFilled: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await esperarSuperficieDeBadge(canvasElement)
  },
}

export const PlainIsTransparent: Story = {
  args: { readOnly: true, variant: 'plain' },
  play: async ({ canvasElement }) => {
    await esperarSuperficiePlana(canvasElement)
  },
}

export const DisplayLabelReplacesFormattedRange: Story = {
  args: { displayLabel: '02/03/2026 – 15/04/2026', readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('02/03/2026 – 15/04/2026'),
    ).toBeInTheDocument()
    await expect(canvas.queryByText('Mar 2 – Apr 15')).toBeNull()
  },
}

export const EmptyKeepsFallbackOverDisplayLabel: Story = {
  args: {
    displayLabel: '02/03/2026 – 15/04/2026',
    fallback: 'Sem período',
    locale: undefined,
    readOnly: true,
    value: undefined,
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Sem período'),
    ).toBeInTheDocument()
  },
}

export const OpenEndedFrom: Story = {
  args: { readOnly: true, value: { from: march, to: undefined } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('A partir de Mar 2'),
    ).toBeInTheDocument()
  },
}

export const OpenEndedUntil: Story = {
  args: { readOnly: true, value: { from: undefined, to: april } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Até Apr 15'),
    ).toBeInTheDocument()
  },
}

export const CustomFromLabel: Story = {
  args: {
    fromLabel: 'From',
    readOnly: true,
    untilLabel: 'Until',
    value: { from: march, to: undefined },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('From Mar 2'),
    ).toBeInTheDocument()
  },
}

export const CustomUntilLabel: Story = {
  args: {
    fromLabel: 'From',
    readOnly: true,
    untilLabel: 'Until',
    value: { from: undefined, to: april },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Until Apr 15'),
    ).toBeInTheDocument()
  },
}

export const FallbackWithNeitherEnd: Story = {
  args: {
    fallback: 'Sem período',
    locale: undefined,
    readOnly: true,
    value: undefined,
  },
  play: async ({ canvasElement }) => {
    const surface = within(canvasElement)
      .getByText('Sem período')
      .closest('[data-slot="property-surface"]')

    await expect(surface).toHaveAttribute('data-empty', 'true')
  },
}

export const BadgeWithoutOnValueChange: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Period/ }),
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

export const OpensTwoMonths: Story = {
  args: { ariaLabel: 'Período', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )

    await expect(await screen.findAllByRole('grid')).toHaveLength(2)
    await expect(screen.getByText('March 2026')).toBeInTheDocument()
    await expect(screen.getByText('April 2026')).toBeInTheDocument()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const CalendarLocaleTranslatesGrid: Story = {
  args: {
    ariaLabel: 'Período',
    calendarLocale: ptBR,
    locale: 'pt-BR',
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    await expect(await screen.findByText('março 2026')).toBeInTheDocument()
    const [grid] = await screen.findAllByRole('grid')

    await expect(
      within(grid as HTMLElement).getByText('seg'),
    ).toBeInTheDocument()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DisabledDoesNotOpen: Story = {
  args: { ariaLabel: 'Período', disabled: true, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Período: Mar 2 – Apr 15',
    })

    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })

    await expect(screen.queryAllByRole('grid')).toHaveLength(0)
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const CompletesRangeFromOpenEnd: Story = {
  args: {
    ariaLabel: 'Período',
    onValueChange: fn(),
    value: { from: march, to: undefined },
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: A partir de Mar 2',
      }),
    )
    await userEvent.click(await firstDayEleven())

    const last = lastRange(args.onValueChange)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(last?.from?.toISOString()).toBe(march.toISOString())
    await expect(last?.to?.getDate()).toBe(11)
    await closeCalendar()
  },
}

export const StaysOpenAfterFirstClick: Story = {
  args: {
    ariaLabel: 'Período',
    locale: undefined,
    onValueChange: fn(),
    value: undefined,
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Sem período',
      }),
    )
    await userEvent.click(await firstDayEleven())

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(lastRange(args.onValueChange)?.from).toBeTruthy()
    await expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0)
    await closeCalendar()
  },
}

export const ClearsBothEnds: Story = {
  args: { ariaLabel: 'Período', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await userEvent.click(await screen.findByText('Limpar período'))

    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined)
    await waitFor(() => expect(screen.queryAllByRole('grid')).toHaveLength(0))
  },
}

export const WithoutAllowClearNoClearButton: Story = {
  args: { allowClear: false, ariaLabel: 'Período', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await screen.findAllByRole('grid')

    await expect(screen.queryByText('Limpar período')).toBeNull()
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const CentersPopupByDefault: Story = {
  args: { ariaLabel: 'Período', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await waitFor(() => expect(positionerAlign()).toBe('center'))
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const DropdownPlacementAligns: Story = {
  args: {
    ariaLabel: 'Período',
    dropdownPlacement: { align: 'start' },
    onValueChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await waitFor(() => expect(positionerAlign()).toBe('start'))
    await closeCalendar()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}
