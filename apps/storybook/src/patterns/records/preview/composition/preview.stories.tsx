import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordPreview } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const openChange = fn()

const openChanges = () => openChange.mock.calls.map(([next]) => next)

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const slotIn = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.ownerDocument.querySelector<HTMLElement>(
    `[data-slot="${slot}"]`,
  )

interface FocusReturnProps {
  finalFocus: () => HTMLElement | null
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
    closeLabel: 'Close preview',
    onOpenChange: openChange,
    open: true,
    title: 'Task 42',
  },
  component: RecordPreview,
  render: (args) => (
    <RecordPreview {...args}>
      <p>Body</p>
    </RecordPreview>
  ),
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Composition/Preview',
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
  render: (args) => <RecordPreview {...args} />,
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
    await expect(panel).toBeTruthy()
    await expect(panel?.contains(footer ?? null)).toBe(false)
    await expect(footer?.closest('[data-slot="scroll-area"]')).toBeNull()
  },
}

export const EscapeRequestsClosing: Story = {
  play: async ({ canvasElement }) => {
    openChange.mockClear()
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const CloseButtonRequestsClosing: Story = {
  play: async ({ canvasElement }) => {
    openChange.mockClear()

    await userEvent.click(
      await page(canvasElement).findByRole('button', { name: 'Close preview' }),
    )

    await waitFor(() => expect(openChanges()).toEqual([false]))
  },
}

export const OutsidePressRequestsClosing: Story = {
  play: async ({ canvasElement }) => {
    openChange.mockClear()
    await page(canvasElement).findByRole('dialog', { name: 'Task 42' })
    const viewport = slotIn(canvasElement, 'sheet-viewport')
    if (!viewport) throw new Error('sheet viewport not rendered')

    await userEvent.click(viewport)

    await waitFor(() => expect(openChanges()).toEqual([false]))
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

export const LongTitleIsNotTruncated: Story = {
  args: { title: 'A very long record title '.repeat(12) },
  play: async ({ canvasElement }) => {
    await page(canvasElement).findByRole('dialog')
    const title = slotIn(canvasElement, 'sheet-title')

    await expect(title?.className.includes('truncate')).toBe(false)
    await expect(title?.parentElement?.className).toContain('min-w-0')
    await expect(
      page(canvasElement).getByRole('button', { name: 'Close preview' }),
    ).toBeTruthy()
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
