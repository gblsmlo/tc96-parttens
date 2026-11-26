import { LinkIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { richTextToPlainText } from '@tc96/ui/helpers/rich-text'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordDialogBarShell } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-shells'
import { RichTextEditor } from '@tc96/ui/patterns/rich-text-editor/rich-text-editor'
import { useMemo, useState } from 'react'
import { resolveRecordDialog5Labels } from './labels'
import {
  createRecordDialog5PriorityOptions,
  createRecordDialog5StatusOptions,
} from './options'
import type { RecordDialog5Props, RecordDialog5Values } from './types'

const isEmpty = (values: RecordDialog5Values) =>
  values.title.trim() === '' && richTextToPlainText(values.body).trim() === ''

export function RecordDialog5({
  className,
  labels: labelsProp,
  note = null,
  onCopyLink,
  onOpenChange,
  onSave,
  open,
  people,
  priorityOptions: priorityOptionsProp,
  recordName,
  statusOptions: statusOptionsProp,
}: Readonly<RecordDialog5Props>) {
  const labels = useMemo(
    () => resolveRecordDialog5Labels(labelsProp),
    [labelsProp],
  )
  const statusOptions = useMemo(
    () => statusOptionsProp ?? createRecordDialog5StatusOptions(labels),
    [labels, statusOptionsProp],
  )
  const priorityOptions = useMemo(
    () => priorityOptionsProp ?? createRecordDialog5PriorityOptions(labels),
    [labels, priorityOptionsProp],
  )
  const [shownNote, setShownNote] = useState(note)
  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? [])
  const [status, setStatus] = useState(note?.status ?? 'planned')
  const [priority, setPriority] = useState(note?.priority ?? 'none')
  const [responsible, setResponsible] = useState(note?.responsible ?? null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const values: RecordDialog5Values = {
    body,
    priority,
    responsible,
    status,
    title: title.trim(),
  }

  const reset = () => {
    setTitle(note?.title ?? '')
    setBody(note?.body ?? [])
    setStatus(note?.status ?? 'planned')
    setPriority(note?.priority ?? 'none')
    setResponsible(note?.responsible ?? null)
    setErrorMessage(null)
  }

  if (note !== shownNote) {
    setShownNote(note)
    reset()
  }

  return (
    <RecordDialog
      actions={
        note && onCopyLink ? (
          <Button
            aria-label={labels.copyLink}
            onClick={() => onCopyLink(note.id)}
            size="icon"
            variant="ghost"
          >
            <LinkIcon aria-hidden />
          </Button>
        ) : undefined
      }
      bodyWidth="readable"
      className={className}
      errorMessage={errorMessage}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      onSubmit={async () => {
        setErrorMessage(null)
        try {
          await onSave(values)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : labels.saveFailed,
          )
          return false
        }
        return true
      }}
      open={open}
      size="large"
      stretchBody
      submitDisabled={isEmpty(values)}
      submitLabel={note ? labels.save : labels.create}
      submitOnModEnter
      submittingLabel={labels.saving}
      title={note ? labels.editTitle : labels.newTitle}
      titleAncestor={recordName}
    >
      <RecordDialogBarShell
        bar={
          <>
            <SelectProperty
              ariaLabel={labels.status}
              onValueChange={(value) => setStatus(value ?? 'planned')}
              options={statusOptions}
              value={status}
              variant="plain"
            />
            <SelectProperty
              ariaLabel={labels.priority}
              onValueChange={(value) => setPriority(value ?? 'none')}
              options={priorityOptions}
              value={priority}
              variant="plain"
            />
            <PersonProperty
              ariaLabel={labels.responsible}
              onValueChange={setResponsible}
              options={people}
              placeholder={labels.responsible}
              value={responsible}
              variant="plain"
            />
          </>
        }
        headline={
          <RecordDialogHeadline
            onTitleChange={setTitle}
            title={title}
            titleLabel={labels.titleLabel}
            titlePlaceholder={labels.titlePlaceholder}
          />
        }
      >
        <RichTextEditor
          aria-label={labels.bodyLabel}
          defaultValue={body.length > 0 ? body : undefined}
          onValueChange={setBody}
          placeholder={labels.bodyPlaceholder}
        />
      </RecordDialogBarShell>
    </RecordDialog>
  )
}
