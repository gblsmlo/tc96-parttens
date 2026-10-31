import type { DateRange } from '@daypicker/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeProperty } from '@tc96/parttens'
import {
  expect,
  fn,
  type Mock,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

const march = new Date(2026, 2, 2)
const april = new Date(2026, 3, 15)

// COSS calendar weekday and outside-month text is 3.14:1 in light and 3.29:1 in dark (below 4.5:1); COSS stays unmodified, so only the contrast check is off.
const cossCalendarContrast = {
  a11y: { config: { rules: [{ enabled: false, id: 'color-contrast' }] } },
}

const meta = {
  args: { locale: 'en-US', value: { from: march, to: april } },
  component: DateRangeProperty,
  decorators: [
    (Story) => (
      <div className="flex min-h-136 items-start p-4">
        <Story />
      </div>
    ),
  ],
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

export const JoinsBothEnds: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Mar 2 – Apr 15'),
    ).toBeInTheDocument()
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
    await expect(
      within(canvasElement).getByText('Sem período'),
    ).toBeInTheDocument()
  },
}

export const BadgeWithoutOnValueChange: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: /Period/ }),
    ).toBeNull()
  },
}

export const CompletesRangeFromOpenEnd: Story = {
  args: {
    ariaLabel: 'Período',
    onValueChange: fn(),
    value: { from: march, to: undefined },
  },
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: A partir de Mar 2',
      }),
    )
    await userEvent.click(await firstDayEleven())

    const last = lastRange(args.onValueChange)
    await expect(last?.from?.toISOString()).toBe(march.toISOString())
    await expect(last?.to?.getDate()).toBe(11)
  },
}

export const StaysOpenAfterFirstClick: Story = {
  args: {
    ariaLabel: 'Período',
    locale: undefined,
    onValueChange: fn(),
    value: undefined,
  },
  parameters: cossCalendarContrast,
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Sem período',
      }),
    )
    await userEvent.click(await firstDayEleven())

    await expect(lastRange(args.onValueChange)?.from).toBeTruthy()
    await expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0)
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

    await expect(args.onValueChange).toHaveBeenCalled()
    await expect(args.onValueChange).toHaveBeenLastCalledWith(undefined)
  },
}

export const CentersPopupByDefault: Story = {
  args: { ariaLabel: 'Período', onValueChange: fn() },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await waitFor(() => expect(positionerAlign()).toBe('center'))
  },
}

export const DropdownPlacementAligns: Story = {
  args: {
    ariaLabel: 'Período',
    dropdownPlacement: { align: 'start' },
    onValueChange: fn(),
  },
  parameters: cossCalendarContrast,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Período: Mar 2 – Apr 15',
      }),
    )
    await waitFor(() => expect(positionerAlign()).toBe('start'))
  },
}
