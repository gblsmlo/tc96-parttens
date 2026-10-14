import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog, type RecordDialogSize } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const sizes = [
  { label: 'Small', size: 'small' },
  { label: 'Default', size: 'default' },
  { label: 'Large', size: 'large' },
] as const satisfies readonly { label: string; size: RecordDialogSize }[]

function SizesDemo() {
  const [open, setOpen] = useState<RecordDialogSize | null>(null)

  return (
    <>
      <div className="flex gap-2">
        {sizes.map(({ label, size }) => (
          <Button key={size} onClick={() => setOpen(size)} variant="outline">
            {label}
          </Button>
        ))}
      </div>
      {sizes.map(({ label, size }) => (
        <RecordDialog
          cancelLabel="Cancel"
          key={size}
          onOpenChange={(next) => setOpen(next ? size : null)}
          onSubmit={() => true}
          open={open === size}
          size={size}
          submitLabel="Create"
          title={`${label} dialog`}
          titleAncestor="Lemind"
        >
          <p className="text-muted-foreground text-sm">
            A short body to compare the {label.toLowerCase()} width.
          </p>
        </RecordDialog>
      ))}
    </>
  )
}

const meta = {
  component: SizesDemo,
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog on one shell with three sizes. The create bodies are in Create and the failure feedback in Failed Submit.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog',
} satisfies Meta<typeof SizesDemo>

export default meta

type Story = StoryObj<typeof meta>

const screen = () => within(document.body)

export const Sizes: Story = {
  render: () => <SizesDemo />,
}

const expectedMaxWidth = { default: 672, large: 896, small: 448 }

export const SizesInteraction: Story = {
  ...Sizes,
  play: async () => {
    const { page } = await import('vitest/browser')
    const { innerHeight, innerWidth } = window
    await page.viewport(1280, 900)

    try {
      for (const { label, size } of sizes) {
        await userEvent.click(screen().getByRole('button', { name: label }))
        const dialog = await screen().findByRole('dialog', {
          name: `${label} dialog`,
        })

        expect(dialog.getAttribute('data-size')).toBe(size)
        expect(getComputedStyle(dialog).maxWidth).toBe(
          `${expectedMaxWidth[size]}px`,
        )
        await waitFor(() =>
          expect(dialog.getBoundingClientRect().width).toBe(
            expectedMaxWidth[size],
          ),
        )

        await userEvent.click(
          within(dialog).getByRole('button', { name: 'Cancel' }),
        )
        await waitFor(() => expect(screen().queryByRole('dialog')).toBeNull())
      }
    } finally {
      await page.viewport(innerWidth, innerHeight)
    }
  },
  tags: ['!dev', '!autodocs'],
}
