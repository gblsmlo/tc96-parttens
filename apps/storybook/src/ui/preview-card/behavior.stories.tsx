import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { previewCardControlArgs } from './preview-card-controls.ts'
import {
  ComposedPreviewCard,
  SharedPreviewCard,
} from './preview-card-layouts.tsx'

interface BehaviorArgs {
  onOpenChange: (open: boolean) => void
}

const { title, trigger } = previewCardControlArgs

const closed = { ...previewCardControlArgs, open: false }

const shortDelay = 50

const timeout = 5000

const popupSelector = '[data-slot="preview-card-content"]'

const queryPopup = () => document.querySelector<HTMLElement>(popupSelector)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const pointAt = async (element: HTMLElement) => {
  const { height, left, top, width } = element.getBoundingClientRect()
  await userEvent.pointer({
    coords: { clientX: left + width / 2, clientY: top + height / 2 },
    target: element,
  })
}

const findPopup = async (limit = timeout) => {
  const heading = await screen.findByText(title, {}, { timeout: limit })
  const popup = heading.closest<HTMLElement>(popupSelector) as HTMLElement
  await waitFor(() => expect(popup).toBeVisible(), { timeout })
  return popup
}

const waitForClosed = () =>
  waitFor(() => expect(queryPopup()).toBeNull(), { timeout })

const closeWithEscape = async () => {
  await userEvent.keyboard('{Escape}')
  await waitForClosed()
}

const meta = {
  args: { onOpenChange: fn() },
  argTypes: { onOpenChange: { control: false } },
  decorators: [
    (Story) => (
      <div className="p-24">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  render: ({ onOpenChange }) => (
    <ComposedPreviewCard
      {...closed}
      delay={shortDelay}
      onOpenChange={onOpenChange}
    />
  ),
  tags: ['!autodocs'],
  title: 'UI/PreviewCard/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensOnHover: Story = {
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await expect(queryPopup()).toBeNull()
    await pointAt(link)
    await findPopup()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-hover' }),
    )
    await expect(link).toHaveAttribute('data-popup-open')
    await closeWithEscape()
  },
}

export const WaitsForDelay: Story = {
  render: () => <ComposedPreviewCard {...closed} delay={3000} />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await pointAt(link)
    await wait(1000)
    await expect(queryPopup()).toBeNull()
    await findPopup(8000)
    await closeWithEscape()
  },
}

export const ClosesWhenPointerLeaves: Story = {
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await pointAt(link)
    await findPopup()
    await userEvent.unhover(link)
    await userEvent.pointer({
      coords: { clientX: innerWidth - 8, clientY: innerHeight - 8 },
      target: document.body,
    })
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-hover' }),
    )
    await expect(link).not.toHaveAttribute('data-popup-open')
  },
}

export const StaysOpenOverPopup: Story = {
  render: () => (
    <ComposedPreviewCard {...closed} closeDelay={1500} delay={shortDelay} />
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await pointAt(link)
    const popup = await findPopup()
    await userEvent.unhover(link)
    await pointAt(popup)
    await wait(2500)
    await expect(queryPopup()).toBe(popup)
    await closeWithEscape()
  },
}

export const OpensOnKeyboardFocus: Story = {
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await findPopup()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-focus' }),
    )
    await expect(link).toHaveFocus()
    await closeWithEscape()
  },
}

export const ClosesWhenFocusLeaves: Story = {
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await findPopup()
    await userEvent.tab()
    await expect(link).not.toHaveFocus()
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'trigger-focus' }),
    )
  },
}

export const ClosesOnEscape: Story = {
  render: ({ onOpenChange }) => (
    <ComposedPreviewCard
      {...previewCardControlArgs}
      onOpenChange={onOpenChange}
    />
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
    <ComposedPreviewCard
      {...previewCardControlArgs}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await findPopup()
    await userEvent.click(canvasElement)
    await waitForClosed()
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    )
  },
}

export const PlacedUnderTrigger: Story = {
  render: () => (
    <div className="flex w-80 justify-center">
      <ComposedPreviewCard {...previewCardControlArgs} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    const popup = await findPopup()
    await expect(popup).toHaveAttribute('data-side', 'bottom')
    await expect(popup).toHaveAttribute('data-align', 'center')
    await waitFor(
      () => {
        const anchor = link.getBoundingClientRect()
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

export const PlainLinkForAssistiveTech: Story = {
  render: () => <ComposedPreviewCard {...previewCardControlArgs} />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: trigger })
    const popup = await findPopup()
    await expect(link).not.toHaveAttribute('aria-haspopup')
    await expect(link).not.toHaveAttribute('aria-expanded')
    await expect(link).not.toHaveAttribute('aria-describedby')
    await expect(popup).not.toHaveAttribute('role')
    await closeWithEscape()
  },
}

export const SharedPopupFollowsTrigger: Story = {
  render: () => <SharedPreviewCard defaultOpen={false} delay={shortDelay} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole('link', { name: 'First link' })
    const second = canvas.getByRole('link', { name: 'Second link' })
    await pointAt(second)
    const text = await screen.findByText('Second preview', {}, { timeout })
    await waitFor(() => expect(text).toBeVisible(), { timeout })
    await expect(second).toHaveAttribute('data-popup-open')
    await expect(first).not.toHaveAttribute('data-popup-open')
    await expect(screen.queryByText('First preview')).toBeNull()
    await closeWithEscape()
  },
}
