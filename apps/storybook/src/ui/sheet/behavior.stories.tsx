import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { sheetControlArgs } from './sheet-controls.ts'
import {
  ComposedSheet,
  DetachedTriggerSheet,
  ScrollingPanelSheet,
} from './sheet-layouts.tsx'

interface BehaviorArgs {
  onAction: () => void
  onOpenChange: (open: boolean) => void
}

const { actionLabel, cancelLabel, description, title, trigger } =
  sheetControlArgs

const desktop = { viewport: { isRotated: false, value: 'desktop' } }

const mobile = { viewport: { isRotated: false, value: 'mobile2' } }

const pageWidth = () => document.documentElement.clientWidth

const pageHeight = () => window.innerHeight

const popupOf = (sheet: HTMLElement) =>
  sheet.closest('[data-slot="sheet-popup"]') as HTMLElement

const panelViewportOf = (sheet: HTMLElement) =>
  sheet.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement

const fadesOf = (viewport: HTMLElement) => {
  const mask = getComputedStyle(viewport).maskImage
  const fades: string[] = []
  if (mask.includes('to top, rgb(0, 0, 0) calc(100% - 24px)')) {
    fades.push('top')
  }
  if (mask.includes('linear-gradient(rgb(0, 0, 0) calc(100% - 24px)')) {
    fades.push('bottom')
  }
  return fades
}

const openSheet = async () => popupOf(await screen.findByRole('dialog'))

const closeSheet = async () => {
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
  title: 'UI/Sheet/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const OpensFromTrigger: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSheet
      {...sheetControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(button)
    const sheet = await screen.findByRole('dialog')
    await waitFor(() => expect(sheet).toBeVisible())
    await expect(args.onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeSheet()
  },
}

export const NamedByTitle: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    await expect(sheet).toHaveAccessibleDescription(description)
    await closeSheet()
  },
}

export const FocusStaysInside: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} defaultOpen={false} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: trigger }),
    )
    const sheet = await screen.findByRole('dialog')
    const cancel = within(sheet).getByRole('button', { name: cancelLabel })
    const action = within(sheet).getByRole('button', { name: actionLabel })
    const close = within(sheet).getByRole('button', { name: 'Close' })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(action).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(close).toHaveFocus())
    await userEvent.tab()
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.tab({ shift: true })
    await waitFor(() => expect(close).toHaveFocus())
    await closeSheet()
  },
}

export const ClosesOnOutsidePress: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSheet {...sheetControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    await screen.findByRole('dialog')
    const viewport = document.querySelector(
      '[data-slot="sheet-viewport"]',
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
    <ComposedSheet
      {...sheetControlArgs}
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
    <ComposedSheet
      {...sheetControlArgs}
      defaultOpen={false}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    const sheet = await screen.findByRole('dialog')
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
    await waitFor(() => expect(button).toHaveFocus())
  },
}

export const HidesCloseButton: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} showCloseButton={false} />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    await expect(
      within(sheet).queryByRole('button', { name: 'Close' }),
    ).toBeNull()
    await closeSheet()
  },
}

export const ActionKeepsOpen: Story = {
  render: ({ onAction, onOpenChange }) => (
    <ComposedSheet
      {...sheetControlArgs}
      onAction={onAction}
      onOpenChange={onOpenChange}
    />
  ),
  play: async ({ args }) => {
    const sheet = await screen.findByRole('dialog')
    await userEvent.click(
      within(sheet).getByRole('button', { name: actionLabel }),
    )
    await expect(args.onAction).toHaveBeenCalledOnce()
    await expect(sheet).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
    await closeSheet()
  },
}

export const CancelCloses: Story = {
  render: ({ onOpenChange }) => (
    <ComposedSheet {...sheetControlArgs} onOpenChange={onOpenChange} />
  ),
  play: async ({ args }) => {
    const sheet = await screen.findByRole('dialog')
    await userEvent.click(
      within(sheet).getByRole('button', { name: cancelLabel }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    )
  },
}

export const RightSpansHeight: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} side="right" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(0, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight(), 0)
    await expect(box.width).toBeCloseTo(448, 0)
    await closeSheet()
  },
}

export const LeftSpansHeight: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} side="left" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().left).toBeCloseTo(0, 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(0, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight(), 0)
    await expect(box.width).toBeCloseTo(448, 0)
    await closeSheet()
  },
}

export const LeavesPageVisibleOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedSheet {...sheetControlArgs} side="right" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    await expect(popup.getBoundingClientRect().left).toBeCloseTo(48, 0)
    await closeSheet()
  },
}

export const TopSpansWidth: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} side="top" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().top).toBeCloseTo(0, 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(0, 0)
    await expect(box.width).toBeCloseTo(pageWidth(), 0)
    await expect(box.bottom).toBeLessThan(pageHeight() / 2)
    await closeSheet()
  },
}

export const BottomSpansWidth: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} side="bottom" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().bottom).toBeCloseTo(pageHeight(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.left).toBeCloseTo(0, 0)
    await expect(box.width).toBeCloseTo(pageWidth(), 0)
    await expect(box.top).toBeGreaterThan(pageHeight() / 2)
    await closeSheet()
  },
}

export const TallTopStopsShort: Story = {
  render: () => <ScrollingPanelSheet side="top" />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    const popup = popupOf(sheet)
    const viewport = panelViewportOf(sheet)
    await waitFor(() =>
      expect(popup.getBoundingClientRect().top).toBeCloseTo(0, 0),
    )
    await expect(popup.getBoundingClientRect().bottom).toBeCloseTo(
      pageHeight() - 48,
      0,
    )
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    await expect(
      within(sheet).getByRole('button', { name: actionLabel }),
    ).toBeVisible()
    await closeSheet()
  },
}

export const FooterSitsAtBottom: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} />,
  play: async () => {
    const popup = await openSheet()
    const footer = popup.querySelector(
      '[data-slot="sheet-footer"]',
    ) as HTMLElement
    const body = within(popup).getByText(sheetControlArgs.body)
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    await expect(footer.getBoundingClientRect().bottom).toBeCloseTo(
      popup.getBoundingClientRect().bottom,
      0,
    )
    await expect(
      footer.getBoundingClientRect().top - body.getBoundingClientRect().bottom,
    ).toBeGreaterThan(pageHeight() / 2)
    await closeSheet()
  },
}

export const PanelScrollsInside: Story = {
  render: () => <ScrollingPanelSheet />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(sheet)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    const box = popupOf(sheet).getBoundingClientRect()
    await expect(box.bottom).toBeLessThanOrEqual(pageHeight())
    await expect(
      within(sheet).getByRole('button', { name: actionLabel }),
    ).toBeVisible()
    await expect(
      within(sheet).getByRole('heading', { name: title }),
    ).toBeVisible()
    await closeSheet()
  },
}

export const ScrollFadeFollowsOverflow: Story = {
  render: () => <ScrollingPanelSheet />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(sheet)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    await waitFor(() => expect(fadesOf(viewport)).toEqual(['bottom']))
    viewport.scrollTop = viewport.scrollHeight
    await waitFor(() => expect(fadesOf(viewport)).toEqual(['top']))
    await closeSheet()
  },
}

export const ScrollFadeOff: Story = {
  render: () => <ScrollingPanelSheet scrollFade={false} />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    const viewport = panelViewportOf(sheet)
    await waitFor(() =>
      expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight),
    )
    await expect(getComputedStyle(viewport).maskImage).toBe('none')
    await closeSheet()
  },
}

export const InsetFloatsOnWideScreens: Story = {
  globals: desktop,
  render: () => <ComposedSheet {...sheetControlArgs} variant="inset" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(
        pageWidth() - 16,
        0,
      ),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(16, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight() - 16, 0)
    await expect(
      Number.parseFloat(getComputedStyle(popup).borderTopLeftRadius),
    ).toBeGreaterThan(0)
    await closeSheet()
  },
}

export const InsetTallTopStopsShort: Story = {
  globals: desktop,
  render: () => <ScrollingPanelSheet side="top" variant="inset" />,
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: title })
    const popup = popupOf(sheet)
    await waitFor(() =>
      expect(popup.getBoundingClientRect().top).toBeCloseTo(16, 0),
    )
    await expect(popup.getBoundingClientRect().bottom).toBeCloseTo(
      pageHeight() - 16,
      0,
    )
    await closeSheet()
  },
}

export const InsetFlushOnMobile: Story = {
  globals: mobile,
  render: () => <ComposedSheet {...sheetControlArgs} variant="inset" />,
  play: async () => {
    const popup = await openSheet()
    await waitFor(() =>
      expect(popup.getBoundingClientRect().right).toBeCloseTo(pageWidth(), 0),
    )
    const box = popup.getBoundingClientRect()
    await expect(box.top).toBeCloseTo(0, 0)
    await expect(box.bottom).toBeCloseTo(pageHeight(), 0)
    await expect(getComputedStyle(popup).borderTopLeftRadius).toBe('0px')
    await closeSheet()
  },
}

export const DetachedTriggerOpens: Story = {
  render: () => <DetachedTriggerSheet />,
  play: async ({ canvasElement }) => {
    await screen.findByRole('dialog', { name: title })
    await closeSheet()
    const button = within(canvasElement).getByRole('button', { name: trigger })
    await userEvent.click(button)
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: title })).toBeVisible(),
    )
    await expect(button).toHaveAttribute('data-popup-open')
    await closeSheet()
  },
}
