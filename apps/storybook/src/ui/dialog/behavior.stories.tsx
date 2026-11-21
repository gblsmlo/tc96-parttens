import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { dialogControlArgs } from './dialog-controls.ts'
import {
  ComposedDialog,
  DetachedTriggerDialog,
  NestedDialog,
  ScrollingPanelDialog,
} from './dialog-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
  onOpenChange: (open: boolean) => void
}

const { actionLabel, cancelLabel, description, title, trigger } =
  dialogControlArgs

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }

const popupOf = (dialog: HTMLElement) =>
  dialog.closest('[data-slot="dialog-popup"]') as HTMLElement

const panelViewportOf = (dialog: HTMLElement) =>
  dialog.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement

const closeWithEscape = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
}

const meta = {
  args: { onAction: fn(), onOpenChange: fn() },
  argTypes: {
    onAction: { control: false },
    onOpenChange: { control: false },
  },
  tags: ['!autodocs'],
  title: 'UI/Dialog/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDialog
      {...dialogControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const NamedByTitle: Story = {
  render: () => <ComposedDialog {...dialogControlArgs} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: title })
    await expect(dialog).toHaveAccessibleDescription(description)
  },
}

export const FocusStaysInside: Story = {
  render: () => <ComposedDialog {...dialogControlArgs} defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const dialog = await screen.findByRole('dialog')
    const cancel = within(dialog).getByRole('button', { name: cancelLabel })
    const action = within(dialog).getByRole('button', { name: actionLabel })
    const close = within(dialog).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(action).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(close).toHaveFocus())
    await closeWithEscape()
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDialog {...dialogControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog')
    const viewport = document.querySelector(
      '[data-slot="dialog-viewport"]',
    ) as HTMLElement
    await userEvent.click(viewport)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    )
  },
}

export const EscapeRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDialog
      {...dialogControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const CloseButtonRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDialog
      {...dialogControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const HidesCloseButton: Story = {
  render: () => (
    <ComposedDialog {...dialogControlArgs} showCloseButton={false} />
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: title })
    await expect(
      within(dialog).queryByRole('button', { name: 'Close' }),
    ).toBeNull()
    await expect(
      within(dialog).getByRole('button', { name: cancelLabel }),
    ).toBeVisible()
  },
}

export const ActionKeepsOpen: Story = {
  render: ({ onAction, onOpenChange }) => (
    <ComposedDialog
      {...dialogControlArgs}
      onAction={onAction}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: actionLabel }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(dialog).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const CancelCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedDialog {...dialogControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: cancelLabel }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
  },
}

export const PanelScrollsInside: Story = {
  render: () => <ScrollingPanelDialog />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(dialog)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    const box = popupOf(dialog).getBoundingClientRect()
    await expect(box.bottom).toBeLessThanOrEqual(window.innerHeight)
    await expect(
      within(dialog).getByRole('button', { name: actionLabel }),
    ).toBeVisible()
    await expect(
      within(dialog).getByRole('heading', { name: title }),
    ).toBeVisible()
  },
}

export const ScrollFadeMasksOverflow: Story = {
  render: () => <ScrollingPanelDialog />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(dialog)
    await waitFor(() =>
      expect(getComputedStyle(viewport).maskImage).toContain('gradient'),
    )
  },
}

export const ScrollFadeOff: Story = {
  render: () => <ScrollingPanelDialog scrollFade={false} />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(dialog)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    await expect(getComputedStyle(viewport).maskImage).toBe('none')
  },
}

export const BottomStickOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedDialog {...dialogControlArgs} />,
  play: async () => {
    const popup = popupOf(await screen.findByRole('dialog'))
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(
        window.innerHeight,
        0,
      ),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBe(0)
    await expect(box.width).toBeCloseTo(document.documentElement.clientWidth, 0)
  },
}

export const FloatsWithoutBottomStick: Story = {
  globals: mobile,
  render: () => (
    <ComposedDialog {...dialogControlArgs} bottomStickOnMobile={false} />
  ),
  play: async () => {
    const popup = popupOf(await screen.findByRole('dialog'))
    await waitFor(() =>
      expect(popup.getBoundingClientRect().left).toBeGreaterThan(0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.bottom).toBeLessThan(window.innerHeight)
    await expect(box.right).toBeLessThan(document.documentElement.clientWidth)
  },
}

export const DetachedTriggerOpens: Story = {
  render: () => <DetachedTriggerDialog />,
  play: async ({ canvasElement }) => {
    await screen.findByRole('dialog', { name: title })
    await closeWithEscape()
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(button.closest('[data-slot="dialog-popup"]')).toBeNull()
    await userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: title })).toBeVisible(),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const NestedClosesAlone: Story = {
  render: () => <NestedDialog />,
  play: async () => {
    const parent = await screen.findByRole('dialog', { name: 'Parent dialog' })
    await userEvent.click(within(parent).getByRole('button', { name: trigger }))
    const child = await screen.findByRole('dialog', { name: title })
    await expect(child).toHaveAttribute('data-nested')
    await waitFor(() =>
      expect(parent).toHaveAttribute('data-nested-dialog-open'),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: title })).toBeNull(),
    )
    await expect(parent).toBeVisible()
    await expect(parent).not.toHaveAttribute('data-nested-dialog-open')
  },
}
