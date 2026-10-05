import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordPreview, RecordPreviewAction } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

interface PreviewDemoProps {
  defaultOpen?: boolean
  footer?: boolean
  longBody?: boolean
  longTitle?: boolean
  onOpenPage?: () => void
}

const lines = Array.from({ length: 24 }, (_, index) => index + 1)

function PreviewDemo({
  defaultOpen = false,
  footer = false,
  longBody = false,
  longTitle = false,
  onOpenPage,
}: Readonly<PreviewDemoProps>) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open preview
      </Button>
      <RecordPreview
        actions={
          <RecordPreviewAction label="Open as page" onClick={onOpenPage}>
            <Maximize2Icon aria-hidden="true" />
          </RecordPreviewAction>
        }
        closeLabel="Close preview"
        description="Sprint 12"
        footer={
          footer ? (
            <>
              <Button onClick={() => setOpen(false)} variant="ghost">
                Cancel
              </Button>
              <Button>Restore</Button>
            </>
          ) : undefined
        }
        onOpenChange={setOpen}
        open={open}
        title={
          longTitle
            ? 'Rework the onboarding flow so that the sign-up, the e-mail check and the first project share one continuous path'
            : 'Implement onboarding'
        }
      >
        {longBody ? (
          <div className="flex flex-col gap-2">
            {lines.map((line) => (
              <p className="text-sm" key={line}>
                Line {line} of the record body. The panel scrolls while the
                header and the footer stay in place.
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm">
            The shell has no content of its own: the consumer passes the body.
          </p>
        )}
      </RecordPreview>
    </>
  )
}

const meta = {
  args: { onOpenPage: fn() },
  component: PreviewDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordPreview is a modal right-side sheet for previewing a record. The consumer owns the open state, the content and the trigger; closeLabel has no default.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordPreview',
} satisfies Meta<typeof PreviewDemo>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Open preview',
    })
    trigger.focus()
    await userEvent.keyboard('{Enter}')

    const dialog = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })
    await waitFor(() => expect(dialog).toHaveFocus())
    expect(dialog).toHaveAttribute('tabindex', '-1')
    expect(
      within(dialog).getAllByRole('button', { name: 'Close preview' }),
    ).toHaveLength(1)
    await waitFor(() =>
      expect(within(dialog).getByText('Sprint 12')).toBeVisible(),
    )

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Open as page' }),
    )
    expect(args.onOpenPage).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
  tags: ['!dev', '!autodocs'],
}

export const WithFooter: Story = {
  args: { defaultOpen: true, footer: true, longBody: true },
}

export const WithFooterInteraction: Story = {
  ...WithFooter,
  play: async () => {
    const dialog = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })
    const panel = dialog.querySelector('[data-slot="sheet-panel"]')
    const footer = dialog.querySelector('[data-slot="sheet-footer"]')

    expect(footer).toBeVisible()
    expect(panel?.contains(footer ?? null)).toBe(false)
    const buttons = within(footer as HTMLElement).getAllByRole('button')
    expect(buttons.map((button) => button.textContent)).toEqual([
      'Cancel',
      'Restore',
    ])
    const popup = dialog.getBoundingClientRect()
    expect(footer?.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      popup.bottom + 1,
    )

    await userEvent.click(buttons[0] as HTMLElement)
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}

export const WithoutFooterInteraction: Story = {
  ...Default,
  args: { defaultOpen: true },
  play: async () => {
    const dialog = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })

    expect(dialog.querySelector('[data-slot="sheet-footer"]')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}

export const LongContent: Story = {
  args: { defaultOpen: true, longBody: true, longTitle: true },
}

export const LongContentInteraction: Story = {
  ...LongContent,
  play: async () => {
    const dialog = await screen().findByRole('dialog', {
      name: /^Rework the onboarding flow/,
    })
    const close = within(dialog).getByRole('button', { name: 'Close preview' })
    const popup = dialog.getBoundingClientRect()
    const box = close.getBoundingClientRect()
    const title = dialog.querySelector('[data-slot="sheet-title"]')

    expect(close).toBeVisible()
    expect(box.right).toBeLessThanOrEqual(popup.right)
    expect(box.top).toBeGreaterThanOrEqual(popup.top)
    expect(
      (title as HTMLElement).getBoundingClientRect().height,
    ).toBeGreaterThan(40)
    expect(title?.scrollWidth).toBeLessThanOrEqual(
      (title as HTMLElement).clientWidth,
    )
  },
  tags: ['!dev', '!autodocs'],
}
