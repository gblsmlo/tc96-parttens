import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { RadioGroupPrimitive, RadioPrimitive } from '@tc96/ui/radio-group'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tc96/ui/segmented-control'
import {
  expect,
  fn,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { segmentedControlControlArgs } from './segmented-control-controls.ts'
import { ComposedSegmentedControl } from './segmented-control-layouts.tsx'
import { segmentedControlSizeNames } from './segmented-control-variants.ts'

interface BehaviorArgs {
  onSubmit: (value: FormDataEntryValue | null) => void
  onValueChange: (value: unknown) => void
}

const meta = {
  args: { onSubmit: fn(), onValueChange: fn() },
  argTypes: {
    onSubmit: { control: false },
    onValueChange: { control: false },
  },
  tags: ['!autodocs'],
  title: 'UI/SegmentedControl/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const indicatorOf = (root: HTMLElement) => {
  const indicator = root.querySelector<HTMLElement>(
    '[data-slot="segmented-control-indicator"]',
  )
  if (!indicator) throw new Error('The indicator is not rendered')
  return indicator
}

const expectIndicatorOver = (indicator: HTMLElement, item: HTMLElement) =>
  waitFor(() => {
    const target = item.getBoundingClientRect()
    const pill = indicator.getBoundingClientRect()
    expect(Math.abs(pill.left - target.left)).toBeLessThanOrEqual(1)
    expect(Math.abs(pill.top - target.top)).toBeLessThanOrEqual(1)
    expect(Math.abs(pill.width - target.width)).toBeLessThanOrEqual(1)
    expect(Math.abs(pill.height - target.height)).toBeLessThanOrEqual(1)
  })

export const ChecksClickedItem: Story = {
  render: ({ onValueChange }) => (
    <ComposedSegmentedControl
      {...segmentedControlControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const week = canvas.getByRole('radio', { name: 'Week' })
    const month = canvas.getByRole('radio', { name: 'Month' })
    await expect(week).toBeChecked()
    await expect(week).toHaveAttribute('data-checked')
    await userEvent.click(month)
    await expect(month).toBeChecked()
    await expect(month).toHaveAttribute('data-checked')
    await expect(week).not.toBeChecked()
    await expect(week).not.toHaveAttribute('data-checked')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledWith('month')
  },
}

export const IndicatorFollowsActiveItem: Story = {
  render: () => <ComposedSegmentedControl {...segmentedControlControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const indicator = indicatorOf(canvas.getByRole('radiogroup'))
    await expectIndicatorOver(
      indicator,
      canvas.getByRole('radio', { name: 'Week' }),
    )
    const month = canvas.getByRole('radio', { name: 'Month' })
    await userEvent.click(month)
    await expectIndicatorOver(indicator, month)
  },
}

export const IndicatorHiddenWithoutActiveItem: Story = {
  render: () => (
    <ComposedSegmentedControl {...segmentedControlControlArgs} value="none" />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const indicator = indicatorOf(canvas.getByRole('radiogroup'))
    for (const radio of canvas.getAllByRole('radio')) {
      await expect(radio).not.toBeChecked()
    }
    await expect(indicator).toHaveAttribute('hidden')
    await expect(indicator).not.toBeVisible()
    const day = canvas.getByRole('radio', { name: 'Day' })
    await userEvent.click(day)
    await waitFor(() => expect(indicator).toBeVisible())
    await expectIndicatorOver(indicator, day)
  },
}

export const DecorativeIndicator: Story = {
  render: () => <ComposedSegmentedControl {...segmentedControlControlArgs} />,
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByRole('radiogroup', {
      name: 'Range',
    })
    const indicator = indicatorOf(root)
    await expect(indicator).toBeVisible()
    await expect(isInaccessible(indicator)).toBe(true)
    await expect(within(root).getAllByRole('radio')).toHaveLength(3)
  },
}

export const ArrowKeysMoveSelection: Story = {
  render: () => <ComposedSegmentedControl {...segmentedControlControlArgs} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const week = canvas.getByRole('radio', { name: 'Week' })
    const month = canvas.getByRole('radio', { name: 'Month' })
    await userEvent.tab()
    await expect(week).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(month).toHaveFocus()
    await expect(month).toBeChecked()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(week).toHaveFocus()
    await expect(week).toBeChecked()
  },
}

export const IndicatorFollowsCurrentPage: Story = {
  render: () => (
    <ComposedSegmentedControl {...segmentedControlControlArgs} element="link" />
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation')
    await expectIndicatorOver(
      indicatorOf(nav),
      within(nav).getByRole('link', { name: 'Week' }),
    )
  },
}

export const RenderedItemHasNoType: Story = {
  render: () => (
    <ComposedSegmentedControl {...segmentedControlControlArgs} element="link" />
  ),
  play: async ({ canvasElement }) => {
    for (const link of within(canvasElement).getAllByRole('link')) {
      await expect(link).not.toHaveAttribute('type')
    }
  },
}

export const PassesPropsToRenderedElement: Story = {
  render: () => <ComposedSegmentedControl {...segmentedControlControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Range',
    })
    await expect(group).toHaveAttribute('data-slot', 'segmented-control')
    await expect(group).toHaveAttribute('data-size', 'default')
  },
}

export const ToggleCanBeCleared: Story = {
  render: ({ onValueChange }) => (
    <ComposedSegmentedControl
      {...segmentedControlControlArgs}
      element="toggle"
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Range' })
    const week = within(group).getByRole('button', { name: 'Week' })
    await expect(week).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(week)
    await expect(week).toHaveAttribute('aria-pressed', 'false')
    await expect(week).not.toHaveAttribute('data-pressed')
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledWith([])
    await waitFor(() => expect(indicatorOf(group)).not.toBeVisible())
  },
}

export const DisabledItemIgnoresClick: Story = {
  render: ({ onValueChange }) => (
    <ComposedSegmentedControl
      {...segmentedControlControlArgs}
      disabledItem
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const month = canvas.getByRole('radio', { name: 'Month' })
    await expect(month).toHaveAttribute('data-disabled')
    await expect(getComputedStyle(month).pointerEvents).toBe('none')
    await userEvent.click(month, { pointerEventsCheck: 0 })
    await expect(month).not.toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Week' })).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const SizesGrowInHeight: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      {segmentedControlSizeNames.map((size) => (
        <ComposedSegmentedControl
          {...segmentedControlControlArgs}
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const roots = within(canvasElement).getAllByRole('radiogroup')
    const heights: number[] = []
    for (const [index, size] of segmentedControlSizeNames.entries()) {
      const root = roots[index]
      if (!root) throw new Error(`No control for size ${size}`)
      await expect(root).toHaveAttribute('data-size', size)
      for (const item of within(root).getAllByRole('radio')) {
        await expect(item).toHaveAttribute('data-size', size)
      }
      heights.push(
        within(root).getByRole('radio', { name: 'Day' }).offsetHeight,
      )
    }
    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(segmentedControlSizeNames.length)
  },
}

export const ItemSizeOverridesRoot: Story = {
  render: () => (
    <SegmentedControl aria-label="Range" size="sm">
      <SegmentedControlItem>Day</SegmentedControlItem>
      <SegmentedControlItem size="lg">Week</SegmentedControlItem>
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const day = canvas.getByRole('button', { name: 'Day' })
    const week = canvas.getByRole('button', { name: 'Week' })
    await expect(day).toHaveAttribute('data-size', 'sm')
    await expect(week).toHaveAttribute('data-size', 'lg')
    await expect(week.offsetHeight).toBeGreaterThan(day.offsetHeight)
  },
}

export const ItemNeverSubmitsByDefault: Story = {
  render: ({ onSubmit }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(null)
      }}
    >
      <SegmentedControl aria-label="Range">
        <SegmentedControlItem>Day</SegmentedControlItem>
        <SegmentedControlItem>Week</SegmentedControlItem>
      </SegmentedControl>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const day = within(canvasElement).getByRole('button', { name: 'Day' })
    await expect(day).toHaveAttribute('type', 'button')
    await userEvent.click(day)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const IndicatorKeepsFormSubmission: Story = {
  render: ({ onSubmit }) => (
    <form
      className="flex items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(new FormData(event.currentTarget).get('range'))
      }}
    >
      <SegmentedControl
        aria-label="Range"
        render={<RadioGroupPrimitive defaultValue="week" name="range" />}
      >
        <SegmentedControlItem render={<RadioPrimitive.Root value="day" />}>
          Day
        </SegmentedControlItem>
        <SegmentedControlItem render={<RadioPrimitive.Root value="week" />}>
          Week
        </SegmentedControlItem>
        <SegmentedControlItem render={<RadioPrimitive.Root value="month" />}>
          Month
        </SegmentedControlItem>
      </SegmentedControl>
      <Button type="submit">Apply</Button>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(indicatorOf(canvas.getByRole('radiogroup'))).toBeVisible()
    await userEvent.click(canvas.getByRole('radio', { name: 'Month' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }))
    await expect(args.onSubmit).toHaveBeenCalledOnce()
    await expect(args.onSubmit).toHaveBeenCalledWith('month')
  },
}
