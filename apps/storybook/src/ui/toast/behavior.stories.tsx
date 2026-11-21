import type { Meta, StoryObj } from '@storybook/react-vite'
import { anchoredToastManager, toastManager } from '@tc96/ui/toast'
import {
  expect,
  fn,
  isInaccessible,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { toastControlArgs } from './toast-controls.ts'
import {
  AnchoredToast,
  ArchiveWithUndo,
  ComposedToast,
  SaveDraft,
  SaveSettings,
  UploadFiles,
} from './toast-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
}

const { description, title } = toastControlArgs

const showToast = async (canvasElement: HTMLElement, name = 'Show toast') => {
  const trigger = within(canvasElement).getByRole('button', { name })
  await userEvent.click(trigger)
  return trigger
}

const closeAllToasts = async () => {
  toastManager.close()
  anchoredToastManager.close()
  await waitFor(() => expect(screen.queryAllByRole('dialog')).toHaveLength(0), {
    timeout: 3000,
  })
}

const meta = {
  args: { onAction: fn() },
  argTypes: { onAction: { control: false } },
  tags: ['!autodocs'],
  title: 'UI/Toast/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const ShowsOnAdd: Story = {
  render: () => <ComposedToast {...toastControlArgs} showOnMount={false} />,
  play: async ({ canvasElement }) => {
    await expect(screen.queryByRole('dialog')).toBeNull()
    await showToast(canvasElement)
    const toast = await screen.findByRole('dialog', { name: title })
    await expect(toast).toHaveAccessibleDescription(description)
    await closeAllToasts()
  },
}

export const AnnouncedWithoutFocus: Story = {
  render: () => <ComposedToast {...toastControlArgs} showOnMount={false} />,
  play: async ({ canvasElement }) => {
    const trigger = await showToast(canvasElement)
    const region = screen.getByRole('region', { name: 'Notifications' })
    await expect(region).toHaveAttribute('aria-live', 'polite')
    await expect(
      await within(region).findByRole('dialog', { name: title }),
    ).toBeInTheDocument()
    await expect(trigger).toHaveFocus()
    await closeAllToasts()
  },
}

export const TypeIconHidden: Story = {
  render: () => (
    <ComposedToast
      {...toastControlArgs}
      showOnMount={false}
      title="Changes saved"
      type="success"
    />
  ),
  play: async ({ canvasElement }) => {
    await showToast(canvasElement)
    const toast = await screen.findByRole('dialog', { name: 'Changes saved' })
    const icon = toast.querySelector('[data-slot="toast-icon"] svg')
    await expect(icon).not.toBeNull()
    await expect(isInaccessible(icon as Element)).toBe(true)
    await closeAllToasts()
  },
}

export const ActionRunsAndCloses: Story = {
  render: ({ onAction }) => (
    <ArchiveWithUndo onUndo={onAction} showOnMount={false} />
  ),
  play: async ({ args, canvasElement }) => {
    await showToast(canvasElement, 'Archive')
    await userEvent.click(await screen.findByRole('button', { name: 'Undo' }))
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(
      await screen.findByText('Message restored'),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByText('Message archived')).not.toBeInTheDocument(),
    )
    await closeAllToasts()
  },
}

export const SameIdUpdatesInPlace: Story = {
  render: () => <SaveSettings showOnMount={false} />,
  play: async ({ canvasElement }) => {
    const save = await showToast(canvasElement, 'Save')
    const toast = await screen.findByRole('dialog', { name: 'Settings saved' })
    await expect(toast.className).not.toMatch(/animate-toast-success/)
    await userEvent.click(save)
    await waitFor(() =>
      expect(toast.className).toMatch(/animate-toast-success-odd/),
    )
    await expect(screen.getAllByText('Settings saved')).toHaveLength(1)
    await closeAllToasts()
  },
}

export const ClosesAfterTimeout: Story = {
  render: () => (
    <ComposedToast {...toastControlArgs} showOnMount={false} timeout={1000} />
  ),
  play: async ({ canvasElement }) => {
    await showToast(canvasElement)
    await expect(
      await screen.findByRole('dialog', { name: title }),
    ).toBeInTheDocument()
    await waitFor(
      () => expect(screen.queryByRole('dialog', { name: title })).toBeNull(),
      { timeout: 5000 },
    )
  },
}

export const PromiseSettles: Story = {
  render: () => <UploadFiles delay={1500} showOnMount={false} />,
  play: async ({ canvasElement }) => {
    await showToast(canvasElement, 'Upload files')
    const toast = await screen.findByRole('dialog', { name: 'Uploading…' })
    await expect(toast).toHaveAttribute('data-type', 'loading')
    await waitFor(() => expect(toast).toHaveAccessibleName('Upload complete'), {
      timeout: 5000,
    })
    await expect(toast).toHaveAttribute('data-type', 'success')
    await expect(toast).toHaveAccessibleDescription('3 files uploaded')
    await expect(screen.getAllByRole('dialog')).toHaveLength(1)
    await closeAllToasts()
  },
}

export const AnchoredToElement: Story = {
  decorators: [
    (Story) => (
      <div className="p-24">
        <Story />
      </div>
    ),
  ],
  render: () => <SaveDraft showOnMount={false} />,
  play: async ({ canvasElement }) => {
    const save = await showToast(canvasElement, 'Save draft')
    const region = screen.getByRole('region', {
      name: 'Anchored notifications',
    })
    const text = await within(region).findByText('Draft saved')
    await waitFor(() => expect(text).toBeVisible())
    const popup = text.closest('[role="dialog"]') as HTMLElement
    await waitFor(() => {
      const anchor = save.getBoundingClientRect()
      const box = popup.getBoundingClientRect()
      const gap = Math.min(
        Math.abs(anchor.top - box.bottom),
        Math.abs(box.top - anchor.bottom),
      )
      expect(gap).toBeLessThan(10)
    })
    await userEvent.unhover(save)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Save draft')).toBeNull(), {
      timeout: 3000,
    })
    await closeAllToasts()
  },
}

export const TooltipStyleShowsTitleOnly: Story = {
  render: () => <AnchoredToast showOnMount={false} tooltipStyle />,
  play: async ({ canvasElement }) => {
    await showToast(canvasElement)
    const toast = await screen.findByRole('dialog', { name: 'Heads up!' })
    await expect(
      within(toast).queryByText('Describe what happened here.'),
    ).toBeNull()
    await expect(toast.querySelector('[data-slot="toast-icon"]')).toBeNull()
    await closeAllToasts()
  },
}

export const PlacedByPosition: Story = {
  render: () => <ComposedToast {...toastControlArgs} position="top-center" />,
  play: async () => {
    const toast = await screen.findByRole('dialog', { name: title })
    await waitFor(() => {
      const box = toast.getBoundingClientRect()
      expect(box.top).toBeGreaterThanOrEqual(0)
      expect(box.bottom).toBeLessThan(window.innerHeight / 2)
      expect(box.left + box.width / 2).toBeCloseTo(
        document.documentElement.clientWidth / 2,
        0,
      )
    })
    await closeAllToasts()
  },
}
