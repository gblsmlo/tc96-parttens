import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordPreview,
  RecordPreviewAction,
  type RecordPreviewActionProps,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Maximize2Icon } from 'lucide-react'
import { type ReactElement, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { recordPreviewArgTypes } from '../../../test-utils/story-arg-types'

const lines = Array.from({ length: 24 }, (_, index) => index + 1)

const meta = {
  argTypes: recordPreviewArgTypes,
  args: {
    actions: (
      <RecordPreviewAction label="Open as page" onClick={fn()}>
        <Maximize2Icon aria-hidden />
      </RecordPreviewAction>
    ),
    children: (
      <p className="text-sm">
        The shell has no content of its own: the consumer passes the body.
      </p>
    ),
    closeLabel: 'Close preview',
    description: 'Sprint 12',
    onOpenChange: fn(),
    open: false,
    title: 'Implement onboarding',
  },
  component: RecordPreview,
  parameters: {
    docs: {
      description: {
        component:
          'RecordPreview is a modal right-side sheet for previewing a record. The consumer owns the open state, the content and the trigger; closeLabel has no default.',
      },
    },
  },
  render: function Preview(args) {
    const [open, setOpen] = useState(args.open)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open preview
        </Button>
        <RecordPreview {...args} onOpenChange={setOpen} open={open}>
          {args.children}
        </RecordPreview>
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview',
} satisfies Meta<typeof RecordPreview>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

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

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const { onClick } = (args.actions as ReactElement<RecordPreviewActionProps>)
      .props
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
    expect(onClick).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
  tags: ['!dev', '!autodocs'],
}

export const WithFooter: Story = {
  args: { children: longBody, open: true },
  render: function WithFooter(args) {
    const [open, setOpen] = useState(args.open)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open preview
        </Button>
        <RecordPreview
          {...args}
          footer={
            <>
              <Button onClick={() => setOpen(false)} variant="ghost">
                Cancel
              </Button>
              <Button>Restore</Button>
            </>
          }
          onOpenChange={setOpen}
          open={open}
        >
          {args.children}
        </RecordPreview>
      </>
    )
  },
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
  args: { open: true },
  play: async () => {
    const dialog = await screen().findByRole('dialog', {
      name: 'Implement onboarding',
    })

    expect(dialog.querySelector('[data-slot="sheet-footer"]')).toBeNull()
  },
  tags: ['!dev', '!autodocs'],
}

export const LongContent: Story = {
  args: {
    children: longBody,
    open: true,
    title:
      'Rework the onboarding flow so that the sign-up, the e-mail check and the first project share one continuous path',
  },
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
