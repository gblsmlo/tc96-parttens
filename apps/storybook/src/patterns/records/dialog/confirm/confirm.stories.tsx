import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordConfirmDialog } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'

const targets = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Archive', value: 'archive' },
  { label: 'Q4 planning', value: 'q4-planning' },
]

interface ConfirmArgs {
  onArchive: (target: string) => void
  onDelete: () => void
}

const meta = {
  args: { onArchive: fn((_target: string) => {}), onDelete: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'RecordConfirmDialog on the COSS AlertDialog. The destructive tone is the default and puts the initial focus on Cancel; the default tone, with children for a choice, puts it on Confirm.',
      },
    },
  },
  render: function Confirm({ onDelete }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Delete project
        </Button>
        <RecordConfirmDialog
          cancelLabel="Cancel"
          confirmingLabel="Deleting"
          confirmLabel="Delete project"
          description="Aurora and its 12 issues will be removed. This cannot be undone."
          onConfirm={() => {
            onDelete()
            return true
          }}
          onOpenChange={setOpen}
          open={open}
          title="Delete project?"
        />
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Confirm',
} satisfies Meta<ConfirmArgs>

export default meta

type Story = StoryObj<ConfirmArgs>

export const Delete: Story = {}

export const DeleteInteraction: Story = {
  ...Delete,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Delete project?',
    })
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' })
    const confirm = within(dialog).getByRole('button', {
      name: 'Delete project',
    })

    await waitFor(() => expect(cancel).toHaveFocus())
    await expect(dialog).toHaveAttribute('data-tone', 'destructive')
    await userEvent.click(confirm)

    await waitFor(() => expect(args.onDelete).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}

export const ArchiveWithTarget: Story = {
  render: function Archive({ onArchive }) {
    const [open, setOpen] = useState(true)
    const [target, setTarget] = useState<string | null>(null)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Archive project
        </Button>
        <RecordConfirmDialog
          cancelLabel="Cancel"
          confirmDisabled={target === null}
          confirmingLabel="Archiving"
          confirmLabel="Archive project"
          description="Move the 12 open issues of Aurora before archiving it."
          onConfirm={() => {
            if (target === null) return false
            onArchive(target)
            return true
          }}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setTarget(null)
          }}
          open={open}
          title="Archive project?"
          tone="default"
        >
          <Field name="target">
            <FieldLabel>Move issues to</FieldLabel>
            <Select items={targets} onValueChange={setTarget} value={target}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a destination" />
              </SelectTrigger>
              <SelectPopup>
                {targets.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
        </RecordConfirmDialog>
      </>
    )
  },
}

export const ArchiveWithTargetInteraction: Story = {
  ...ArchiveWithTarget,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Archive project?',
    })
    const confirm = within(dialog).getByRole('button', {
      name: 'Archive project',
    })

    await expect(dialog).toHaveAttribute('data-tone', 'default')
    await expect(confirm).toBeDisabled()
    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Move issues to' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Q4 planning' }),
    )
    await waitFor(() => expect(confirm).toBeEnabled())
    await userEvent.click(confirm)

    await waitFor(() =>
      expect(args.onArchive).toHaveBeenCalledWith('q4-planning'),
    )
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
  },
  tags: ['!dev', '!autodocs'],
}
