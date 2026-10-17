import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog, type RecordDialogSize } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { recordDialogArgTypes } from '../../../test-utils/story-arg-types'

const meta = {
  argTypes: recordDialogArgTypes,
  args: {
    cancelLabel: 'Cancel',
    children: (
      <p className="text-muted-foreground text-sm">
        A short body to compare the default width.
      </p>
    ),
    onOpenChange: fn(),
    onSubmit: fn(() => true),
    open: false,
    size: 'default',
    submitLabel: 'Create',
    title: 'Default dialog',
    titleAncestor: 'Lemind',
  },
  component: RecordDialog,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog on one shell with three sizes. The create bodies, and what happens when their save fails, are in Create.',
      },
    },
  },
  render: function Dialog(args) {
    const [open, setOpen] = useState(args.open)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Open dialog
        </Button>
        <RecordDialog {...args} onOpenChange={setOpen} open={open}>
          {args.children}
        </RecordDialog>
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog',
} satisfies Meta<typeof RecordDialog>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

const interaction = ['!dev', '!autodocs']

const expectedMaxWidth: Record<RecordDialogSize, number> = {
  default: 672,
  large: 896,
  small: 448,
}

const expectSize = async (size: RecordDialogSize, title: string) => {
  const { page } = await import('vitest/browser')
  const { innerHeight, innerWidth } = window
  await page.viewport(1280, 900)

  try {
    await userEvent.click(screen().getByRole('button', { name: 'Open dialog' }))
    const dialog = await screen().findByRole('dialog', { name: title })

    expect(dialog.getAttribute('data-size')).toBe(size)
    expect(getComputedStyle(dialog).maxWidth).toBe(
      `${expectedMaxWidth[size]}px`,
    )
    await waitFor(() =>
      expect(dialog.getBoundingClientRect().width).toBe(expectedMaxWidth[size]),
    )

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' }),
    )
    await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
  } finally {
    await page.viewport(innerWidth, innerHeight)
  }
}

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: () => expectSize('default', 'Default dialog'),
  tags: interaction,
}

export const Small: Story = {
  args: {
    children: (
      <p className="text-muted-foreground text-sm">
        A short body to compare the small width.
      </p>
    ),
    size: 'small',
    title: 'Small dialog',
  },
}

export const SmallInteraction: Story = {
  ...Small,
  play: () => expectSize('small', 'Small dialog'),
  tags: interaction,
}

export const Large: Story = {
  args: {
    children: (
      <p className="text-muted-foreground text-sm">
        A short body to compare the large width.
      </p>
    ),
    size: 'large',
    title: 'Large dialog',
  },
}

export const LargeInteraction: Story = {
  ...Large,
  play: () => expectSize('large', 'Large dialog'),
  tags: interaction,
}
