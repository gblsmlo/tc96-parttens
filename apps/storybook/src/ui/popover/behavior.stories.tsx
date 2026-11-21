import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { popoverControlArgs } from './popover-controls.ts'
import { PopoverRoom } from './popover-frame.tsx'
import {
  AnchoredPopover,
  ComposedPopover,
  DetachedTriggersPopover,
  PasswordHintPopover,
  type PopoverOpenChange,
} from './popover-layouts.tsx'

interface BehaviorArgs {
  onOpenChange: PopoverOpenChange
}

const { description, title, trigger } = popoverControlArgs

const closed = { ...popoverControlArgs, defaultOpen: false }

const getTrigger = (canvasElement: HTMLElement, name = trigger) =>
  within(canvasElement).getByRole('button', { name })

const openPopover = async (canvasElement: HTMLElement) => {
  await userEvent.click(getTrigger(canvasElement))
  return screen.findByRole('dialog')
}

const closePopover = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const reason = (value: string) => expect.objectContaining({ reason: value })

const meta = {
  args: { onOpenChange: fn() },
  argTypes: { onOpenChange: { control: false } },
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Popover/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await expect(screen.queryByRole('dialog')).toBeNull()
    await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    const popup = await openPopover(canvasElement)
    await waitFor(() => expect(popup).toBeVisible())
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveAttribute('data-popup-open')
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      reason('trigger-press'),
    )
    await closePopover()
  },
}

export const TriggerCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openPopover(canvasElement)
    await userEvent.click(getTrigger(canvasElement))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      reason('trigger-press'),
    )
  },
}

export const NamedByTitle: Story = {
  render: () => <ComposedPopover {...closed} />,
  play: async ({ canvasElement }) => {
    await openPopover(canvasElement)
    const popup = screen.getByRole('dialog', { name: title })
    await expect(popup).toHaveAccessibleDescription(description)
    await expect(
      within(popup).getByRole('heading', { level: 2, name: title }),
    ).toBeInTheDocument()
    await closePopover()
  },
}

export const FocusMovesInside: Story = {
  render: () => <ComposedPopover {...closed} closeButton />,
  play: async ({ canvasElement }) => {
    getTrigger(canvasElement).focus()
    await userEvent.keyboard('{Enter}')
    const popup = await screen.findByRole('dialog')
    await waitFor(() =>
      expect(
        within(popup).getByRole('button', { name: 'Close' }),
      ).toHaveFocus(),
    )
    await closePopover()
  },
}

export const EscapeRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} closeButton onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    await openPopover(canvasElement)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      reason('escape-key'),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    await openPopover(canvasElement)
    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      reason('outside-press'),
    )
  },
}

export const CloseButtonCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} closeButton onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement)
    const popup = await openPopover(canvasElement)
    await userEvent.click(within(popup).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      reason('close-press'),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const ClosesOnFocusOut: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover {...closed} closeButton onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const popup = await openPopover(canvasElement)
    const close = within(popup).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      reason('focus-out'),
    )
  },
}

export const ModalKeepsFocusInside: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPopover
      {...closed}
      closeButton
      modal
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const popup = await openPopover(canvasElement)
    const close = within(popup).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(close).toHaveFocus())
    await expect(popup).toBeVisible()
    await expect(args.onOpenChange).toHaveBeenCalledTimes(1)
    await closePopover()
  },
}

export const OpensOnHover: Story = {
  render: ({ onOpenChange }) => (
    <PasswordHintPopover defaultOpen={false} onOpenChange={onOpenChange} />
  ),
  play: async ({ args, canvasElement }) => {
    const button = getTrigger(canvasElement, 'Password requirements')
    await userEvent.hover(button)
    const popup = await screen.findByRole('dialog', {
      name: 'Password requirements',
    })
    await waitFor(() => expect(popup).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      reason('trigger-hover'),
    )
    await userEvent.unhover(button)
    await userEvent.hover(within(canvasElement).getByLabelText('Password'))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
}

export const PlacesBySideAndAlign: Story = {
  decorators: [PopoverRoom],
  render: () => (
    <ComposedPopover {...closed} align="start" side="top" sideOffset={16} />
  ),
  play: async ({ canvasElement }) => {
    const button = getTrigger(canvasElement)
    const popup = await openPopover(canvasElement)
    await waitFor(() => expect(popup).toHaveAttribute('data-side', 'top'))
    await expect(popup).toHaveAttribute('data-align', 'start')
    await waitFor(() => {
      const anchor = button.getBoundingClientRect()
      const box = popup.getBoundingClientRect()
      expect(anchor.top - box.bottom).toBeCloseTo(16, 0)
      expect(box.left).toBeCloseTo(anchor.left, 0)
    })
    await closePopover()
  },
}

export const DetachedTriggersShareThePopup: Story = {
  render: () => <DetachedTriggersPopover defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    const first = getTrigger(canvasElement, 'First trigger')
    const second = getTrigger(canvasElement, 'Second trigger')
    await userEvent.click(second)
    const popup = await screen.findByRole('dialog', { name: 'Second panel' })
    await expect(second).toHaveAttribute('aria-expanded', 'true')
    await expect(first).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(first)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: 'First panel' })).toBeVisible(),
    )
    await expect(screen.getAllByRole('dialog')).toHaveLength(1)
    await expect(screen.getByRole('dialog')).toBe(popup)
    await expect(first).toHaveAttribute('aria-expanded', 'true')
    await closePopover()
  },
}

export const FollowsTheAnchor: Story = {
  decorators: [PopoverRoom],
  render: () => <AnchoredPopover defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    const anchor = within(canvasElement).getByTestId('popover-anchor')
    const button = getTrigger(canvasElement)
    const popup = await openPopover(canvasElement)
    await waitFor(() => {
      const box = popup.getBoundingClientRect()
      const target = anchor.getBoundingClientRect()
      expect(box.left).toBeCloseTo(target.left, 0)
      expect(box.top).toBeGreaterThan(target.bottom)
      expect(box.left).toBeLessThan(button.getBoundingClientRect().left)
    })
    await closePopover()
  },
}
