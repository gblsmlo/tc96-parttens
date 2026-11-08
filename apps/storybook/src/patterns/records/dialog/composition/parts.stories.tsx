import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordDialog,
  RecordDialogCreateMore,
  type RecordDialogCreateMoreProps,
  RecordDialogHeadline,
  type RecordDialogHeadlineProps,
} from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

type PartsArgs = Pick<
  RecordDialogHeadlineProps,
  'descriptionLabel' | 'stretch'
> & {
  onCheckedChange: RecordDialogCreateMoreProps['onCheckedChange']
  onOpenChange: (open: boolean) => void
  onTitleChange: RecordDialogHeadlineProps['onTitleChange']
}

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const findDialog = (canvasElement: HTMLElement) =>
  page(canvasElement).findByRole('dialog', { name: 'New card' })

const meta = {
  args: {
    descriptionLabel: 'Description',
    onCheckedChange: fn(),
    onOpenChange: fn(),
    onTitleChange: fn(),
  },
  render: function Parts({
    descriptionLabel,
    onCheckedChange,
    onOpenChange,
    onTitleChange,
    stretch,
  }) {
    const [title, setTitle] = useState('')
    const [createMore, setCreateMore] = useState(false)

    return (
      <RecordDialog
        footerStart={
          <RecordDialogCreateMore
            checked={createMore}
            label="Create more"
            onCheckedChange={(checked) => {
              setCreateMore(checked)
              onCheckedChange(checked)
            }}
          />
        }
        keepOpenOnSuccess={createMore}
        onOpenChange={onOpenChange}
        onSubmit={() => true}
        open
        stretchBody={stretch}
        submitLabel="Save"
        title="New card"
      >
        <RecordDialogHeadline
          descriptionLabel={descriptionLabel}
          descriptionPlaceholder="Add description..."
          onTitleChange={(next) => {
            setTitle(next)
            onTitleChange(next)
          }}
          stretch={stretch}
          title={title}
          titleLabel="Card title"
          titlePlaceholder="Card title"
        />
      </RecordDialog>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Composition/Parts',
} satisfies Meta<PartsArgs>

export default meta
type Story = StoryObj<typeof meta>

export const HeadlineLabelsBothFields: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })
    const description = dialog.getByRole('textbox', { name: 'Description' })

    await expect(title).toHaveAttribute('name', 'title')
    await expect(description.tagName).toBe('TEXTAREA')
    await expect(description).toHaveAttribute('name', 'description')
    await expect((title as HTMLInputElement).labels?.[0]).toHaveTextContent(
      'Card title',
    )
  },
}

export const HeadlineAutofocusesTheTitle: Story = {
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await waitFor(() =>
      expect(dialog.getByRole('textbox', { name: 'Card title' })).toHaveFocus(),
    )
  },
}

export const HeadlineTitleIsControlled: Story = {
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })

    await userEvent.type(title, 'Ship it')

    await expect(title).toHaveValue('Ship it')
    await expect(args.onTitleChange).toHaveBeenLastCalledWith('Ship it')
  },
}

export const HeadlineWithoutDescription: Story = {
  args: { descriptionLabel: undefined },
  play: async ({ canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))

    await expect(dialog.getAllByRole('textbox')).toHaveLength(1)
  },
}

export const HeadlineStretch: Story = {
  args: { stretch: true },
  play: async ({ canvasElement }) => {
    await findDialog(canvasElement)
    const headline = canvasElement.ownerDocument.querySelector(
      '[data-slot="record-dialog-headline"]',
    )

    await expect(headline).toHaveAttribute('data-stretch')
  },
}

export const CreateMoreToggles: Story = {
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const toggle = dialog.getByRole('switch', { name: 'Create more' })

    await expect(toggle).not.toBeChecked()
    await userEvent.click(dialog.getByText('Create more'))
    await expect(toggle).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true)
    await userEvent.click(toggle)
    await expect(toggle).not.toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false)
  },
}

export const CreateMoreKeepsTheDialogOpen: Story = {
  play: async ({ args, canvasElement }) => {
    const dialog = within(await findDialog(canvasElement))
    const title = dialog.getByRole('textbox', { name: 'Card title' })

    await userEvent.click(dialog.getByRole('switch', { name: 'Create more' }))
    await userEvent.type(title, 'First')
    await userEvent.click(dialog.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(title).toHaveFocus())
    await expect(args.onOpenChange).not.toHaveBeenCalledWith(false)
  },
}
