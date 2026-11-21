import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { toggleGroupControlArgs } from './toggle-group-controls.ts'
import {
  ComposedToggleGroup,
  FormattingToolbar,
  ViewSwitcher,
} from './toggle-group-layouts.tsx'

interface BehaviorArgs {
  onValueChange: (value: string[]) => void
}

const meta = {
  args: { onValueChange: fn() },
  argTypes: {
    onValueChange: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ToggleGroup/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

const itemNamed = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name })

export const NamedGroupOfToggleButtons: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Text alignment',
    })
    const items = within(group).getAllByRole('button')
    await expect(items).toHaveLength(3)
    for (const item of items) {
      await expect(item).toHaveAttribute('aria-pressed')
    }
  },
}

export const ClickPressesOneItem: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const center = itemNamed(canvasElement, 'Center')
    await userEvent.click(center)
    await expect(args.onValueChange).toHaveBeenCalledOnce()
    await expect(args.onValueChange).toHaveBeenCalledWith(
      ['center'],
      expect.anything(),
    )
    await expect(center).toHaveAttribute('aria-pressed', 'true')
    await expect(center).toHaveAttribute('data-pressed')
    await expect(itemNamed(canvasElement, 'Left')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const ClickOnPressedItemClears: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const left = itemNamed(canvasElement, 'Left')
    await userEvent.click(left)
    await expect(args.onValueChange).toHaveBeenCalledWith([], expect.anything())
    for (const item of within(canvasElement).getAllByRole('button')) {
      await expect(item).toHaveAttribute('aria-pressed', 'false')
    }
  },
}

export const MultiplePressesSeveral: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      multiple
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).getByRole('group')).toHaveAttribute(
      'data-multiple',
    )
    await userEvent.click(itemNamed(canvasElement, 'Right'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['left', 'right'],
      expect.anything(),
    )
    await userEvent.click(itemNamed(canvasElement, 'Center'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['left', 'right', 'center'],
      expect.anything(),
    )
    await userEvent.click(itemNamed(canvasElement, 'Left'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['right', 'center'],
      expect.anything(),
    )
    await expect(itemNamed(canvasElement, 'Right')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(itemNamed(canvasElement, 'Left')).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  },
}

export const ControlledValueWins: Story = {
  render: () => <ViewSwitcher />,
  play: async ({ canvasElement }) => {
    const board = itemNamed(canvasElement, 'Board')
    await expect(board).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(board)
    await expect(board).toHaveAttribute('aria-pressed', 'true')
  },
}

export const OneTabStop: Story = {
  render: () => (
    <ComposedToggleGroup {...toggleGroupControlArgs} defaultValue={['right']} />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await expect(itemNamed(canvasElement, 'Left')).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.tab()
    for (const item of within(canvasElement).getAllByRole('button')) {
      await expect(item).not.toHaveFocus()
    }
    await userEvent.tab({ shift: true })
    await expect(itemNamed(canvasElement, 'Center')).toHaveFocus()
  },
}

export const ArrowKeysMoveFocusOnly: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const left = itemNamed(canvasElement, 'Left')
    const center = itemNamed(canvasElement, 'Center')
    const right = itemNamed(canvasElement, 'Right')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(center).toHaveFocus()
    await expect(center).toHaveAttribute('aria-pressed', 'false')
    await userEvent.keyboard('{ArrowDown}')
    await expect(center).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(right).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect(left).toHaveFocus()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const ArrowKeysWrap: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(itemNamed(canvasElement, 'Right')).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Left')).toHaveFocus()
  },
}

export const LoopFocusOff: Story = {
  render: () => (
    <ComposedToggleGroup {...toggleGroupControlArgs} loopFocus={false} />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(itemNamed(canvasElement, 'Left')).toHaveFocus()
    await userEvent.keyboard('{End}{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Right')).toHaveFocus()
  },
}

export const VerticalUsesUpAndDown: Story = {
  render: () => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      orientation="vertical"
      variant="outline"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('group')).toHaveAttribute(
      'data-orientation',
      'vertical',
    )
    const center = itemNamed(canvasElement, 'Center')
    await userEvent.tab()
    await userEvent.keyboard('{ArrowDown}')
    await expect(center).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(center).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(itemNamed(canvasElement, 'Left')).toHaveFocus()
  },
}

export const DisabledItemSkipped: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      disabledItem
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const center = itemNamed(canvasElement, 'Center')
    await expect(center).toBeDisabled()
    await expect(center).toHaveAttribute('data-disabled')
    await userEvent.click(center, { pointerEventsCheck: 0 })
    await expect(center).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Right')).toHaveFocus()
  },
}

export const DisabledGroup: Story = {
  render: ({ onValueChange }) => (
    <ComposedToggleGroup
      {...toggleGroupControlArgs}
      disabled
      onValueChange={onValueChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('group')
    await expect(group).toHaveAttribute('data-disabled')
    for (const item of within(group).getAllByRole('button')) {
      await expect(item).toBeDisabled()
      await expect(item).toHaveAttribute('data-disabled')
    }
    const right = itemNamed(canvasElement, 'Right')
    await userEvent.click(right, { pointerEventsCheck: 0 })
    await expect(right).toHaveAttribute('aria-pressed', 'false')
    await expect(args.onValueChange).not.toHaveBeenCalled()
    await userEvent.tab()
    await expect(right).not.toHaveFocus()
    await expect(itemNamed(canvasElement, 'Left')).not.toHaveFocus()
  },
}

export const ItemsTakeGroupLook: Story = {
  render: () => (
    <ToggleGroup
      aria-label="Text alignment"
      defaultValue={['left']}
      size="sm"
      variant="outline"
    >
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem size="lg" value="center" variant="default">
        Center
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group')
    await expect(group).toHaveAttribute('data-variant', 'outline')
    await expect(group).toHaveAttribute('data-size', 'sm')
    const left = itemNamed(canvasElement, 'Left')
    const center = itemNamed(canvasElement, 'Center')
    for (const item of [left, center]) {
      await expect(item).toHaveAttribute('data-variant', 'outline')
      await expect(item).toHaveAttribute('data-size', 'sm')
    }
    await expect(center.getBoundingClientRect().height).toBe(
      left.getBoundingClientRect().height,
    )
  },
}

export const OutlineJoinsItems: Story = {
  render: () => (
    <ComposedToggleGroup {...toggleGroupControlArgs} variant="outline" />
  ),
  play: async ({ canvasElement }) => {
    const left = itemNamed(canvasElement, 'Left')
    const center = itemNamed(canvasElement, 'Center')
    await expect(center.getBoundingClientRect().left).toBe(
      left.getBoundingClientRect().right,
    )
    await expect(getComputedStyle(left).borderTopRightRadius).toBe('0px')
    await expect(getComputedStyle(center).borderTopLeftRadius).toBe('0px')
    await expect(getComputedStyle(left).borderRightWidth).toBe('0px')
    await expect(getComputedStyle(center).borderLeftWidth).toBe('0px')
  },
}

export const DefaultVariantGap: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} />,
  play: async ({ canvasElement }) => {
    const left = itemNamed(canvasElement, 'Left').getBoundingClientRect()
    const center = itemNamed(canvasElement, 'Center').getBoundingClientRect()
    await expect(center.left - left.right).toBe(2)
  },
}

export const VerticalLayoutByVariant: Story = {
  render: () => (
    <div className="flex gap-8">
      <ToggleGroup
        aria-label="Outline"
        orientation="vertical"
        variant="outline"
      >
        <ToggleGroupItem value="top">Top</ToggleGroupItem>
        <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Default" orientation="vertical">
        <ToggleGroupItem value="start">Start</ToggleGroupItem>
        <ToggleGroupItem value="end">End</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const top = itemNamed(canvasElement, 'Top').getBoundingClientRect()
    const bottom = itemNamed(canvasElement, 'Bottom').getBoundingClientRect()
    await expect(bottom.top).toBe(top.bottom)
    await expect(bottom.left).toBe(top.left)
    const start = itemNamed(canvasElement, 'Start').getBoundingClientRect()
    const end = itemNamed(canvasElement, 'End').getBoundingClientRect()
    await expect(end.top).toBe(start.top)
    await expect(end.left).toBeGreaterThan(start.right)
  },
}

export const SeparatorsSkippedByArrowKeys: Story = {
  render: () => <ComposedToggleGroup {...toggleGroupControlArgs} separators />,
  play: async ({ canvasElement }) => {
    const separators = within(canvasElement).getAllByRole('separator')
    await expect(separators).toHaveLength(2)
    for (const separator of separators) {
      await expect(separator).not.toHaveAttribute('tabindex')
    }
    await userEvent.tab()
    await userEvent.keyboard('{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Center')).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Right')).toHaveFocus()
  },
}

export const ItemsInsideTooltipTriggers: Story = {
  render: ({ onValueChange }) => (
    <FormattingToolbar onValueChange={onValueChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const italic = itemNamed(canvasElement, 'Italic')
    await userEvent.click(italic)
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      ['bold', 'italic'],
      expect.anything(),
    )
    await expect(italic).toHaveAttribute('aria-pressed', 'true')
    await expect(italic).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(itemNamed(canvasElement, 'Underline')).toHaveFocus()
    await userEvent.unhover(italic)
    await userEvent.keyboard('{Escape}')
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-slot="tooltip-popup"]'),
        ).toBeNull(),
      { timeout: 5000 },
    )
  },
}
