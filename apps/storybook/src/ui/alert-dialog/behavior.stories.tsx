import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { alertDialogControlArgs } from './alert-dialog-controls.ts'
import {
  ComposedAlertDialog,
  NestedAlertDialog,
} from './alert-dialog-layouts.tsx'

interface BehaviorArgs {
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

const { cancelLabel, confirmLabel, description, title, trigger } =
  alertDialogControlArgs

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }

const popupOf = (dialog: HTMLElement) =>
  dialog.closest('[data-slot="alert-dialog-popup"]') as HTMLElement

const meta = {
  args: { onConfirm: fn(), onOpenChange: fn() },
  argTypes: {
    onConfirm: { control: false },
    onOpenChange: { control: false },
  },
  tags: ['!autodocs'],
  title: 'UI/AlertDialog/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAlertDialog
      {...alertDialogControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(screen.queryByRole('alertdialog')).toBeNull()
    await userEvent.click(button)
    const dialog = await screen.findByRole('alertdialog')
    await waitFor(() => expect(dialog).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
  },
}

export const NamedByTitle: Story = {
  render: () => <ComposedAlertDialog {...alertDialogControlArgs} />,
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', { name: title })
    await expect(dialog).toHaveAccessibleDescription(description)
    await expect(dialog).toHaveAttribute('data-slot', 'alert-dialog-popup')
  },
}

export const FocusStaysInside: Story = {
  render: () => (
    <ComposedAlertDialog {...alertDialogControlArgs} defaultOpen={false} />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const dialog = await screen.findByRole('alertdialog')
    const cancel = within(dialog).getByRole('button', { name: cancelLabel })
    const confirm = within(dialog).getByRole('button', { name: confirmLabel })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(confirm).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(confirm).toHaveFocus())
  },
}

export const IgnoresOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAlertDialog
      {...alertDialogControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args }) => {
    const dialog = await screen.findByRole('alertdialog')
    const viewport = document.querySelector(
      '[data-slot="alert-dialog-viewport"]',
    ) as HTMLElement
    await userEvent.click(viewport)
    await userEvent.click(document.body)
    await expect(dialog).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

export const EscapeRestoresFocus: Story = {
  render: ({ onOpenChange }) => (
    <ComposedAlertDialog
      {...alertDialogControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await screen.findByRole('alertdialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'escape-key' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const Actions: Story = {
  render: ({ onConfirm, onOpenChange }) => (
    <ComposedAlertDialog
      {...alertDialogControlArgs}
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: cancelLabel }),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const reopened = await screen.findByRole('alertdialog')
    await userEvent.click(
      within(reopened).getByRole('button', { name: confirmLabel }),
    )
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  },
}

export const BottomStickOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedAlertDialog {...alertDialogControlArgs} />,
  play: async () => {
    const popup = popupOf(await screen.findByRole('alertdialog'))
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
    <ComposedAlertDialog
      {...alertDialogControlArgs}
      bottomStickOnMobile={false}
    />
  ),
  play: async () => {
    const popup = popupOf(await screen.findByRole('alertdialog'))
    await waitFor(() =>
      expect(popup.getBoundingClientRect().left).toBeGreaterThan(0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.bottom).toBeLessThan(window.innerHeight)
    await expect(box.right).toBeLessThan(document.documentElement.clientWidth)
  },
}

export const NestedClosesAlone: Story = {
  render: () => <NestedAlertDialog />,
  play: async () => {
    const parent = await screen.findByRole('dialog', { name: 'Parent dialog' })
    await userEvent.click(within(parent).getByRole('button', { name: trigger }))
    const dialog = await screen.findByRole('alertdialog', { name: title })
    await expect(dialog).toHaveAttribute('data-nested')
    await waitFor(() =>
      expect(parent).toHaveAttribute('data-nested-dialog-open'),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await expect(parent).toBeVisible()
    await expect(parent).not.toHaveAttribute('data-nested-dialog-open')
  },
}
