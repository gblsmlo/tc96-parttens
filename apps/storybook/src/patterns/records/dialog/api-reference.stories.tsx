import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
} from '@tc96/ui/patterns'
import { Slot } from '../../../test-utils/anatomy-slot'

const ignore = () => undefined

const meta = {
  parameters: {
    docs: { story: { iframeHeight: '520px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Records/RecordDialog/API Reference',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: () => (
    <RecordDialog
      actions={<Slot name="actions" />}
      cancelLabel="cancelLabel"
      description={<Slot name="description" />}
      errorMessage={<Slot name="errorMessage" />}
      footerStart={
        <RecordDialogCreateMore
          checked={false}
          label="RecordDialogCreateMore"
          onCheckedChange={ignore}
        />
      }
      onOpenChange={ignore}
      onSubmit={() => false}
      open
      submitLabel="submitLabel"
      title={<Slot name="title" />}
      titleAncestor="titleAncestor"
    >
      <RecordDialogHeadline
        descriptionLabel="Description"
        descriptionPlaceholder="RecordDialogHeadline description"
        onTitleChange={ignore}
        title=""
        titleLabel="Title"
        titlePlaceholder="RecordDialogHeadline title"
      />
    </RecordDialog>
  ),
}
