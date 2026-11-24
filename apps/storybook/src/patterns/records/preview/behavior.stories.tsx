import { ArrowsOutSimpleIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordPreview,
  RecordPreviewAction,
  type RecordPreviewProps,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, mocked, userEvent, waitFor, within } from 'storybook/test'

const lines = Array.from({ length: 24 }, (_, index) => index + 1)

const longBody = (
  <div className="flex flex-col gap-2">
    {lines.map((line) => (
      <p className="text-sm" key={line}>
        Line {line} of the record body. The panel scrolls while the header and
        the footer stay in place.
      </p>
    ))}
  </div>
)

const longTitle =
  'Rework the onboarding flow so that the sign-up, the e-mail check and the first project share one continuous path'

const openAsPage = (
  <RecordPreviewAction label="Open as page">
    <ArrowsOutSimpleIcon aria-hidden />
  </RecordPreviewAction>
)

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const slotIn = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.ownerDocument.querySelector<HTMLElement>(
    `[data-slot="${slot}"]`,
  )

const openChanges = (args: RecordPreviewProps) =>
  mocked(args.onOpenChange).mock.calls.map(([next]) => next)

interface FocusReturnProps {
  finalFocus?: () => HTMLElement | null
  movesCard?: boolean
}

function FocusReturn({ finalFocus, movesCard = false }: FocusReturnProps) {
  const [open, setOpen] = useState(false)
  const [triggerShown, setTriggerShown] = useState(true)

  return (
    <div className="flex items-center gap-2">
      {triggerShown ? (
        <button onClick={() => setOpen(true)} type="button">
          Trigger
        </button>
      ) : null}
      <button data-moved-card type="button">
        Moved card
      </button>
      <button data-kanban-column-option="done" type="button">
        Done
      </button>
      <RecordPreview
        closeLabel="Close preview"
        finalFocus={finalFocus}
        onOpenChange={setOpen}
        open={open}
        title="Task 42"
      >
        {movesCard ? (
          <button onClick={() => setTriggerShown(false)} type="button">
            Move card
          </button>
        ) : null}
      </RecordPreview>
    </div>
  )
}

const openFromTrigger = async (canvasElement: HTMLElement) => {
  const trigger = within(canvasElement).getByRole('button', {
    name: 'Trigger',
  })
  await userEvent.click(trigger)
  await page(canvasElement).findByRole('dialog', { name: 'Task 42' })
  return trigger
}

const closeWithEscape = async (canvasElement: HTMLElement) => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() =>
    expect(page(canvasElement).queryByRole('dialog')).toBeNull(),
  )
}

const meta = {
  args: {
    children: <p>Body</p>,
    closeLabel: 'Close preview',
    onOpenChange: fn(),
    open: true,
    title: 'Task 42',
  },
  render: (args) => <RecordPreview {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Behavior',
} satisfies Meta<typeof RecordPreview>

export default meta

type Story = StoryObj<typeof meta>

export const NamedByTitleWithOneCloseButton: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: 'Task 42',
    })
    const closes = dialog.querySelectorAll('[data-slot="sheet-close"]')

    await expect(closes).toHaveLength(1)
    await expect(closes[0]).toHaveAttribute('aria-label', 'Close preview')
    await expect(
      page(canvasElement).queryByRole('button', { name: 'Close' }),
    ).toBeNull()
  },
}

export const DescriptionAndActionsBeforeClose: Story = {
  args: {
    actions: <button type="button">Open page</button>,
    description: 'Sprint 12',
  },
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: 'Task 42',
    })
    const slot = slotIn(canvasElement, 'record-preview-header-actions')
    const close = within(dialog).getByRole('button', { name: 'Close preview' })

    await expect(within(dialog).getByText('Sprint 12')).toBeTruthy()
    await expect(slot?.contains(within(dialog).getByText('Open page'))).toBe(
      true,
    )
    await expect(slot?.parentElement).toBe(close.parentElement)
    await expect(
      (slot?.compareDocumentPosition(close) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const NoActionsSlotWithoutActions: Story = {
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })

    await expect(
      slotIn(canvasElement, 'record-preview-header-actions'),
    ).toBeNull()
  },
}

export const NoFooterWithoutFooter: Story = {
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })

    await expect(slotIn(canvasElement, 'sheet-footer')).toBeNull()
  },
}

export const FooterOutsideTheScrollingPanel: Story = {
  args: { footer: <button type="button">Restore</button> },
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })
    const footer = slotIn(canvasElement, 'sheet-footer')
    const panel = slotIn(canvasElement, 'sheet-panel')

    await expect(footer?.textContent).toBe('Restore')
    await expect(
      panel?.closest('[data-slot="scroll-area-viewport"]'),
    ).not.toBeNull()
    await expect(panel?.contains(footer ?? null)).toBe(false)
    await expect(
      footer?.closest('[data-slot="scroll-area-viewport"]'),
    ).toBeNull()
  },
}

export const FooterStaysAtTheBottomWithLongContent: Story = {
  args: { children: longBody, footer: <button type="button">Restore</button> },
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: 'Task 42',
    })
    const footer = slotIn(canvasElement, 'sheet-footer')

    await waitFor(() => expect(footer).toBeVisible())
    await expect(footer?.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      dialog.getBoundingClientRect().bottom + 1,
    )
  },
}

export const EscapeRequestsClosing: Story = {
  play: async ({ args, canvasElement }) => {
    mocked(args.onOpenChange).mockClear()
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const CloseButtonRequestsClosing: Story = {
  play: async ({ args, canvasElement }) => {
    mocked(args.onOpenChange).mockClear()

    await userEvent.click(
      await page(canvasElement).findByRole('button', { name: 'Close preview' }),
    )

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const OutsidePressRequestsClosing: Story = {
  play: async ({ args, canvasElement }) => {
    mocked(args.onOpenChange).mockClear()
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })
    const viewport = slotIn(canvasElement, 'sheet-viewport')
    if (!viewport) throw new Error('sheet viewport not rendered')

    await userEvent.click(viewport)

    await waitFor(() => expect(openChanges(args)).toEqual([false]))
  },
}

export const InitialFocusOnThePopup: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: 'Task 42',
    })

    await expect(dialog).toHaveAttribute('tabindex', '-1')
    await waitFor(() => expect(dialog).toHaveFocus())
  },
}

export const EscapeReturnsFocusToTheTriggerAfterKeyboardOpen: Story = {
  render: () => <FocusReturn />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Trigger',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: 'Task 42',
    })
    await waitFor(() => expect(dialog).toHaveFocus())

    await closeWithEscape(canvasElement)

    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const LongTitleWrapsInsteadOfTruncating: Story = {
  args: { actions: openAsPage, description: 'Sprint 12', title: longTitle },
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog', {
      name: /^Rework the onboarding flow/,
    })
    const title = slotIn(canvasElement, 'sheet-title')

    await expect(title?.getBoundingClientRect().height).toBeGreaterThan(40)
    await expect(title?.scrollWidth).toBeLessThanOrEqual(
      title?.clientWidth ?? 0,
    )
    await expect(getComputedStyle(title as HTMLElement).textOverflow).not.toBe(
      'ellipsis',
    )
  },
}

export const CloseButtonStaysInsideWithLongTitle: Story = {
  args: { actions: openAsPage, description: 'Sprint 12', title: longTitle },
  play: async ({ canvasElement }) => {
    const dialog = await page(canvasElement).findByRole('dialog', {
      name: /^Rework the onboarding flow/,
    })
    const close = within(dialog).getByRole('button', { name: 'Close preview' })
    const popup = dialog.getBoundingClientRect()
    const box = close.getBoundingClientRect()

    await waitFor(() => expect(close).toBeVisible())
    await expect(box.right).toBeLessThanOrEqual(popup.right)
    await expect(box.top).toBeGreaterThanOrEqual(popup.top)
  },
}

export const ClassNameGoesToThePopup: Story = {
  args: { className: 'proof-class' },
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })

    await expect(
      slotIn(canvasElement, 'sheet-popup')?.classList.contains('proof-class'),
    ).toBe(true)
  },
}

export const FinalFocusMovesToTheReturnedElement: Story = {
  render: () => (
    <FocusReturn
      finalFocus={() =>
        document.querySelector<HTMLElement>('[data-moved-card]')
      }
    />
  ),
  play: async ({ canvasElement }) => {
    await openFromTrigger(canvasElement)
    await closeWithEscape(canvasElement)

    await waitFor(() =>
      expect(canvasElement.querySelector('[data-moved-card]')).toHaveFocus(),
    )
  },
}

export const FinalFocusNullKeepsTheTrigger: Story = {
  render: () => <FocusReturn finalFocus={() => null} />,
  play: async ({ canvasElement }) => {
    const trigger = await openFromTrigger(canvasElement)
    await closeWithEscape(canvasElement)

    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const FinalFocusFallsBackToTheColumnOption: Story = {
  render: () => (
    <FocusReturn
      finalFocus={() =>
        document.querySelector<HTMLElement>('[data-record-id="42"]') ??
        document.querySelector<HTMLElement>(
          '[data-kanban-column-option="done"]',
        )
      }
      movesCard
    />
  ),
  play: async ({ canvasElement }) => {
    await openFromTrigger(canvasElement)
    await userEvent.click(
      page(canvasElement).getByRole('button', { name: 'Move card' }),
    )
    await expect(within(canvasElement).queryByText('Trigger')).toBeNull()
    await closeWithEscape(canvasElement)

    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-kanban-column-option="done"]'),
      ).toHaveFocus(),
    )
  },
}
