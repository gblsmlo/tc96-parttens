import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from '@tc96/ui/toggle'
import {
  expect,
  fn,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { toggleControlArgs } from './toggle-controls.ts'
import { ComposedToggle } from './toggle-layouts.tsx'
import { toggleSizeNames } from './toggle-variants.ts'

interface BehaviorArgs {
  onPressedChange: (pressed: boolean) => void
  onSubmit: () => void
}

const meta = {
  args: { onPressedChange: fn(), onSubmit: fn() },
  argTypes: {
    onPressedChange: { control: false },
    onSubmit: { control: false },
  },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Toggle/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const TogglesOnClick: Story = {
  render: ({ onPressedChange }) => (
    <ComposedToggle {...toggleControlArgs} onPressedChange={onPressedChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect(toggle).not.toHaveAttribute('data-pressed')
    await userEvent.click(toggle)
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(toggle).toHaveAttribute('data-pressed')
    await userEvent.click(toggle)
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(
      false,
      expect.anything(),
    )
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const KeyboardToggle: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Enter}')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const FocusVisibleFromKeyboard: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    const restingShadow = getComputedStyle(toggle).boxShadow
    await userEvent.tab()
    await expect(toggle).toHaveFocus()
    await waitFor(() => {
      const focusedShadow = getComputedStyle(toggle).boxShadow
      expect(focusedShadow).not.toBe(restingShadow)
      expect(focusedShadow).toMatch(/0px 0px 0px 3px/)
    })
  },
}

export const IconOnlyNamedByLabel: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} iconOnly />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button')
    await expect(toggle).toHaveAccessibleName('Bold')
    await expect(toggle).toHaveTextContent(/^$/)
    const icon = toggle.querySelector('svg')
    await expect(icon).not.toBeNull()
    await expect(isInaccessible(icon as SVGElement)).toBe(true)
  },
}

export const ControlledFollowsPressed: Story = {
  render: ({ onPressedChange }) => (
    <Toggle onPressedChange={onPressedChange} pressed={false}>
      Bold
    </Toggle>
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.click(toggle)
    await expect(args.onPressedChange).toHaveBeenCalledOnce()
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await expect(toggle).not.toHaveAttribute('data-pressed')
  },
}

export const CanceledChangeKeepsState: Story = {
  render: ({ onPressedChange }) => (
    <Toggle
      onPressedChange={(pressed, eventDetails) => {
        onPressedChange(pressed)
        eventDetails.cancel()
      }}
    >
      Bold
    </Toggle>
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.click(toggle)
    await expect(args.onPressedChange).toHaveBeenCalledOnce()
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const DisabledIgnoresClicks: Story = {
  render: ({ onPressedChange }) => (
    <ComposedToggle
      {...toggleControlArgs}
      disabled
      onPressedChange={onPressedChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await expect(toggle).toBeDisabled()
    await expect(toggle).toHaveAttribute('data-disabled')
    await userEvent.click(toggle, { pointerEventsCheck: 0 })
    await expect(args.onPressedChange).not.toHaveBeenCalled()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const DisabledLeavesTabOrder: Story = {
  render: () => <ComposedToggle {...toggleControlArgs} disabled />,
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await userEvent.tab()
    await expect(toggle).not.toHaveFocus()
  },
}

export const NeverSubmitsForm: Story = {
  render: ({ onSubmit }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Toggle type="submit">Bold</Toggle>
    </form>
  ),
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Bold' })
    await expect(toggle).toHaveAttribute('type', 'button')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const SizesGrowInHeight: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {toggleSizeNames.map((size) => (
        <Toggle key={size} size={size} variant="outline">
          {size}
        </Toggle>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heights = toggleSizeNames.map((size) =>
      Number.parseFloat(
        getComputedStyle(canvas.getByRole('button', { name: size })).height,
      ),
    )
    await expect(heights).toEqual([...heights].sort((a, b) => a - b))
    await expect(new Set(heights).size).toBe(toggleSizeNames.length)
  },
}
