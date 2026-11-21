import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { tooltipControlArgs } from './tooltip-controls.ts'
import { TooltipFrame } from './tooltip-frame.tsx'
import {
  ComposedTooltip,
  GroupedTooltips,
  SharedTooltip,
  type TooltipOpenChange,
} from './tooltip-layouts.tsx'

interface BehaviorArgs {
  onClick: () => void
  onOpenChange: TooltipOpenChange
}

const { text, trigger } = tooltipControlArgs

const closed = { ...tooltipControlArgs, open: false }

const shortDelay = 50

const timeout = 5000

const popupSelector = '[data-slot="tooltip-popup"]'

const queryPopup = () => document.querySelector<HTMLElement>(popupSelector)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const pointAt = async (element: HTMLElement) => {
  const { height, left, top, width } = element.getBoundingClientRect()
  await userEvent.pointer({
    coords: { clientX: left + width / 2, clientY: top + height / 2 },
    target: element,
  })
}

const pointAway = () =>
  userEvent.pointer({
    coords: { clientX: innerWidth - 8, clientY: innerHeight - 8 },
    target: document.body,
  })

const findPopup = async (content = text, limit = timeout) => {
  const node = await screen.findByText(content, {}, { timeout: limit })
  const popup = node.closest<HTMLElement>(popupSelector) as HTMLElement
  await waitFor(() => expect(popup).toBeVisible(), { timeout })
  return popup
}

const waitForClosed = () =>
  waitFor(() => expect(queryPopup()).toBeNull(), { timeout })

const closeWithEscape = async () => {
  await userEvent.keyboard('{Escape}')
  await waitForClosed()
}

const getTrigger = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: trigger })

const meta = {
  args: { onClick: fn(), onOpenChange: fn() },
  argTypes: {
    onClick: { control: false },
    onOpenChange: { control: false },
  },
  decorators: [TooltipFrame],
  parameters: { layout: 'centered' },
  render: ({ onOpenChange }) => (
    <ComposedTooltip
      {...closed}
      delay={shortDelay}
      onOpenChange={onOpenChange}
    />
  ),
  tags: ['!autodocs'],
  title: 'UI/Tooltip/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensOnHover: Story = {
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await expect(queryPopup()).toBeNull()
    await pointAt(button)
    await findPopup()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-hover' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const WaitsForDelay: Story = {
  render: () => <ComposedTooltip {...closed} delay={3000} />,
  play: async ({ canvasElement }) => {
    await pointAt(getTrigger(canvasElement))
    await wait(1000)
    await expect(queryPopup()).toBeNull()
    await findPopup(text, 8000)
    await closeWithEscape()
  },
}

export const ClosesWhenPointerLeaves: Story = {
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await pointAt(button)
    await findPopup()
    await userEvent.unhover(button)
    await pointAway()
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-hover' }),
    )
    await expect(button).not.toHaveAttribute('data-popup-open')
  },
}

export const StaysOpenOverPopup: Story = {
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    await pointAt(button)
    const popup = await findPopup()
    await pointAt(popup)
    await wait(1000)
    await expect(queryPopup()).toBe(popup)
    await closeWithEscape()
  },
}

export const OpensOnFocusWithoutDelay: Story = {
  render: ({ onOpenChange }) => (
    <ComposedTooltip {...closed} delay={3000} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await findPopup(text, 1500)
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-focus' }),
    )
    await expect(button).toHaveFocus()
    await closeWithEscape()
  },
}

export const ClosesWhenFocusLeaves: Story = {
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await findPopup()
    await userEvent.tab()
    await expect(button).not.toHaveFocus()
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-focus' }),
    )
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange }) => (
    <ComposedTooltip {...tooltipControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await findPopup()
    await closeWithEscape()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedTooltip {...tooltipControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await findPopup()
    await userEvent.pointer({
      coords: { clientX: innerWidth - 8, clientY: innerHeight - 8 },
      keys: '[MouseLeft]',
      target: document.body,
    })
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    )
  },
}

export const ClosesOnTriggerPress: Story = {
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await pointAt(button)
    await findPopup()
    await userEvent.click(button)
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await wait(500)
    await expect(queryPopup()).toBeNull()
  },
}

export const PressReachesTriggerOnClick: Story = {
  render: ({ onClick }) => (
    <ComposedTooltip {...closed} delay={shortDelay} onClick={onClick} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await pointAt(button)
    await findPopup()
    await expect(args.onClick).not.toHaveBeenCalled()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
    await waitForClosed()
  },
}

export const PlacedAboveTrigger: Story = {
  render: () => <ComposedTooltip {...tooltipControlArgs} />,
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    const popup = await findPopup()
    await expect(popup).toHaveAttribute('data-side', 'top')
    await expect(popup).toHaveAttribute('data-align', 'center')
    await waitFor(
      () => {
        const anchor = button.getBoundingClientRect()
        const box = popup.getBoundingClientRect()
        expect(Math.round(anchor.top - box.bottom)).toBe(4)
        expect(
          Math.abs(box.left + box.width / 2 - (anchor.left + anchor.width / 2)),
        ).toBeLessThan(1)
      },
      { timeout },
    )
    await closeWithEscape()
  },
}

export const PlacedOnChosenSide: Story = {
  render: () => <ComposedTooltip {...tooltipControlArgs} side="bottom" />,
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    const popup = await findPopup()
    await expect(popup).toHaveAttribute('data-side', 'bottom')
    await waitFor(
      () => {
        const anchor = button.getBoundingClientRect()
        const box = popup.getBoundingClientRect()
        expect(Math.round(box.top - anchor.bottom)).toBe(4)
        expect(
          Math.abs(box.left + box.width / 2 - (anchor.left + anchor.width / 2)),
        ).toBeLessThan(1)
      },
      { timeout },
    )
    await closeWithEscape()
  },
}

export const DisabledNeverOpens: Story = {
  render: ({ onOpenChange }) => (
    <ComposedTooltip
      {...closed}
      delay={shortDelay}
      disabled
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await pointAt(button)
    await wait(1000)
    await expect(queryPopup()).toBeNull()
    await userEvent.unhover(button)
    await pointAway()
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await wait(500)
    await expect(queryPopup()).toBeNull()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const DisabledMarksTrigger: Story = {
  render: () => <ComposedTooltip {...closed} disabled />,
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    await expect(button).toHaveAttribute('data-trigger-disabled')
    await expect(button).toBeEnabled()
  },
}

export const TriggerNotLinkedToPopup: Story = {
  render: () => <ComposedTooltip {...tooltipControlArgs} iconOnly />,
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    const popup = await findPopup()
    await expect(button).not.toHaveAttribute('aria-describedby')
    await expect(popup).not.toHaveAttribute('role')
    await closeWithEscape()
  },
}

export const GroupOpensNextInstantly: Story = {
  render: () => <GroupedTooltips defaultOpen={false} delay={3000} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: 'First action' })
    const second = canvas.getByRole('button', { name: 'Second action' })
    await pointAt(first)
    await findPopup('First action', 8000)
    await userEvent.unhover(first)
    await pointAt(second)
    await findPopup('Second action', 1500)
    await expect(second).toHaveAttribute('data-popup-open')
    await waitFor(() => expect(screen.queryByText('First action')).toBeNull(), {
      timeout,
    })
    await closeWithEscape()
  },
}

export const SharedPopupFollowsTrigger: Story = {
  render: () => <SharedTooltip defaultOpen={false} delay={shortDelay} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('button', { name: 'First' })
    const second = canvas.getByRole('button', { name: 'Second' })
    await pointAt(second)
    await findPopup('The hint of the second trigger')
    await expect(second).toHaveAttribute('data-popup-open')
    await expect(first).not.toHaveAttribute('data-popup-open')
    await expect(screen.queryByText('The hint of the first trigger')).toBeNull()
    await closeWithEscape()
  },
}
