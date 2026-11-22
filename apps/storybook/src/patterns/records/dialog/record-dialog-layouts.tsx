import {
  RecordConfirmDialog,
  type RecordConfirmDialogProps,
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  type RecordDialogProps,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Label } from '@tc96/ui/label'
import { Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { sleep } from '../../../test-utils/sleep'
import type {
  RecordConfirmDialogControls,
  RecordDialogControls,
} from './record-dialog-controls.ts'

interface ComposedRecordDialogProps extends RecordDialogControls {
  defaultOpen?: boolean
  onOpenAsPage?: () => void
  onOpenChange?: (open: boolean) => void
  onSubmit?: RecordDialogProps['onSubmit']
}

export const ComposedRecordDialog = ({
  actions,
  cancelLabel,
  createMore,
  defaultOpen = true,
  description,
  errorMessage,
  headline,
  headlineDescription,
  onOpenAsPage,
  onOpenChange,
  onSubmit,
  size,
  stretchBody,
  submitDisabled,
  submitLabel,
  submitOnModEnter,
  submittingLabel,
  title,
  titleAncestor,
  trigger,
}: Readonly<ComposedRecordDialogProps>) => {
  const [open, setOpen] = useState(defaultOpen)
  const [recordTitle, setRecordTitle] = useState('')
  const [keepOpen, setKeepOpen] = useState(false)

  const save = async () => {
    await sleep(1000)
    if (keepOpen) setRecordTitle('')
    return true
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {trigger}
      </Button>
      <RecordDialog
        actions={
          actions ? (
            <Button
              aria-label="Open as page"
              onClick={onOpenAsPage}
              size="icon"
              variant="ghost"
            >
              <Maximize2Icon aria-hidden />
            </Button>
          ) : undefined
        }
        cancelLabel={cancelLabel || undefined}
        description={description || undefined}
        errorMessage={errorMessage || undefined}
        footerStart={
          createMore ? (
            <RecordDialogCreateMore
              checked={keepOpen}
              label="Create more"
              onCheckedChange={setKeepOpen}
            />
          ) : undefined
        }
        keepOpenOnSuccess={createMore && keepOpen}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setRecordTitle('')
          onOpenChange?.(next)
        }}
        onSubmit={onSubmit ?? save}
        open={open}
        size={size}
        stretchBody={stretchBody}
        submitDisabled={submitDisabled}
        submitLabel={submitLabel}
        submitOnModEnter={submitOnModEnter}
        submittingLabel={submittingLabel || undefined}
        title={title}
        titleAncestor={titleAncestor || undefined}
      >
        {headline ? (
          <RecordDialogHeadline
            descriptionLabel={headlineDescription ? 'Description' : undefined}
            descriptionPlaceholder="Add description..."
            onTitleChange={setRecordTitle}
            stretch={stretchBody}
            title={recordTitle}
            titleLabel="Project title"
            titlePlaceholder="Project title"
          />
        ) : null}
      </RecordDialog>
    </>
  )
}

interface ComposedRecordConfirmDialogProps extends RecordConfirmDialogControls {
  defaultOpen?: boolean
  onConfirm?: RecordConfirmDialogProps['onConfirm']
  onOpenChange?: (open: boolean) => void
}

export const ComposedRecordConfirmDialog = ({
  body,
  cancelLabel,
  confirmDisabled,
  confirmLabel,
  confirmingLabel,
  defaultOpen = true,
  description,
  errorMessage,
  onConfirm,
  onOpenChange,
  title,
  tone,
  trigger,
}: Readonly<ComposedRecordConfirmDialogProps>) => {
  const [open, setOpen] = useState(defaultOpen)

  const confirm = async () => {
    await sleep(1000)
    return true
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {trigger}
      </Button>
      <RecordConfirmDialog
        cancelLabel={cancelLabel}
        confirmDisabled={confirmDisabled}
        confirmingLabel={confirmingLabel || undefined}
        confirmLabel={confirmLabel}
        description={description || undefined}
        errorMessage={errorMessage || undefined}
        onConfirm={onConfirm ?? confirm}
        onOpenChange={(next) => {
          setOpen(next)
          onOpenChange?.(next)
        }}
        open={open}
        title={title}
        tone={tone}
      >
        {body ? (
          <Label>
            <Checkbox />
            Also delete its 12 issues
          </Label>
        ) : null}
      </RecordConfirmDialog>
    </>
  )
}
