import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogCreateMore } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-create-more'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordDialogRowShell } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-shells'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { useMemo, useState } from 'react'
import { resolveRecordDialog3Labels } from './labels'
import {
  createRecordDialog3NextActionOptions,
  createRecordDialog3SourceOptions,
  createRecordDialog3StageOptions,
} from './options'
import type {
  RecordDialog3NextAction,
  RecordDialog3Props,
  RecordDialog3Source,
  RecordDialog3Stage,
  RecordDialog3Values,
} from './types'
import { useRecordDialog3Draft } from './use-record-dialog-3-draft'

export function RecordDialog3({
  className,
  labels: labelsProp,
  nextActionOptions: nextActionOptionsProp,
  onCreate,
  onOpenChange,
  open,
  people,
  sourceOptions: sourceOptionsProp,
  stageOptions: stageOptionsProp,
}: Readonly<RecordDialog3Props>) {
  const labels = useMemo(
    () => resolveRecordDialog3Labels(labelsProp),
    [labelsProp],
  )
  const stageOptions = useMemo(
    () => stageOptionsProp ?? createRecordDialog3StageOptions(labels),
    [labels, stageOptionsProp],
  )
  const sourceOptions = useMemo(
    () => sourceOptionsProp ?? createRecordDialog3SourceOptions(labels),
    [labels, sourceOptionsProp],
  )
  const nextActionOptions = useMemo(
    () => nextActionOptionsProp ?? createRecordDialog3NextActionOptions(labels),
    [labels, nextActionOptionsProp],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useRecordDialog3Draft(() => ({
    nextAction: null as RecordDialog3NextAction | null,
    ownerId: null as string | null,
    source: null as RecordDialog3Source | null,
    stage: 'new' as RecordDialog3Stage,
    title: '',
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)

  const reset = () => {
    resetDraft()
    setErrorMessage(null)
  }

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      className={className}
      errorMessage={errorMessage}
      footerStart={
        <RecordDialogCreateMore
          checked={createMore}
          label={labels.createMore}
          onCheckedChange={setCreateMore}
        />
      }
      keepOpenOnSuccess={createMore}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      onSubmit={async (event) => {
        setErrorMessage(null)
        const data = new FormData(event.currentTarget)
        const values = latest.current
        const parsed: RecordDialog3Values = {
          description: String(data.get('description') ?? '').trim(),
          nextAction: values.nextAction,
          ownerId: values.ownerId,
          source: values.source,
          stage: values.stage,
          title: values.title.trim(),
        }
        if (parsed.title === '') return false
        try {
          await onCreate(parsed)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : labels.saveFailed,
          )
          return false
        }
        if (createMore) reset()
        return true
      }}
      open={open}
      stretchBody
      submitDisabled={draft.title.trim() === ''}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={labels.titleText}
      titleAncestor={labels.titleAncestor}
    >
      <RecordDialogRowShell
        headline={
          <RecordDialogHeadline
            descriptionLabel={labels.description}
            descriptionMinHeight
            descriptionPlaceholder={labels.descriptionPlaceholder}
            onTitleChange={(title) => update({ title })}
            title={draft.title}
            titleLabel={labels.title}
            titlePlaceholder={labels.titlePlaceholder}
          />
        }
      >
        <RecordGroupRow label={labels.stage}>
          <SelectProperty
            ariaLabel={labels.stage}
            onValueChange={(value) =>
              update({ stage: (value as RecordDialog3Stage | null) ?? 'new' })
            }
            options={stageOptions}
            value={draft.stage}
          />
        </RecordGroupRow>
        <RecordGroupRow label={labels.source}>
          <SelectProperty
            ariaLabel={labels.source}
            onValueChange={(value) =>
              update({ source: value as RecordDialog3Source | null })
            }
            options={sourceOptions}
            placeholder={labels.addSource}
            value={draft.source}
          />
        </RecordGroupRow>
        <RecordGroupRow label={labels.owner}>
          <PersonProperty
            ariaLabel={labels.owner}
            dropdownPlacement={{ align: 'start' }}
            onValueChange={(ownerId) => update({ ownerId })}
            options={people}
            placeholder={labels.noOwner}
            value={draft.ownerId}
          />
        </RecordGroupRow>
        <RecordGroupRow label={labels.nextAction}>
          <SelectProperty
            ariaLabel={labels.nextAction}
            onValueChange={(value) =>
              update({ nextAction: value as RecordDialog3NextAction | null })
            }
            options={nextActionOptions}
            placeholder={labels.addNextAction}
            value={draft.nextAction}
          />
        </RecordGroupRow>
      </RecordDialogRowShell>
    </RecordDialog>
  )
}
