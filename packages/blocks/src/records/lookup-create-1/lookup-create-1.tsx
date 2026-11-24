'use client'

import { RecordDialog } from '@tc96/parttens/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogHeadline } from '@tc96/parttens/records/dialog/composition/record-dialog/record-dialog-headline'
import { Alert, AlertAction, AlertDescription } from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { ChevronRightIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { resolveRecordsLabels } from '../shared/labels'
import { StatusRows } from '../shared/status-rows'
import { defaultLookupCreate1Labels } from './labels'
import type { LookupCreate1Labels, LookupCreate1Props } from './types'

function originHint(
  state: LookupCreate1Props['identifierState'],
  labels: LookupCreate1Labels,
) {
  if (state === 'incomplete') return labels.incomplete
  if (state === 'checking') return labels.checking
  if (state === 'taken') return labels.taken
  return undefined
}

export function LookupCreate1({
  alternatives = [],
  children,
  existing,
  identifier,
  identifierState,
  labels: labelsProp,
  onAlternative,
  onIdentifierChange,
  onOpenChange,
  onRetry,
  onStepChange,
  onSubmit,
  onTitleChange,
  open,
  pending = false,
  recordTitle,
  renderLink = renderAnchor,
  sources,
  step,
}: Readonly<LookupCreate1Props>): ReactElement {
  const labels = resolveRecordsLabels(defaultLookupCreate1Labels, labelsProp)

  if (step === 'origin') {
    const available = identifierState === 'available'
    return (
      <RecordDialog
        cancelLabel={labels.cancel}
        onOpenChange={onOpenChange}
        onSubmit={() => {
          if (available) onStepChange('details')
          return false
        }}
        open={open}
        size="small"
        step={step}
        submitDisabled={!available}
        submitHint={originHint(identifierState, labels)}
        submitLabel={labels.continue}
        title={labels.title}
        titleAncestor={labels.ancestor}
      >
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel>{labels.identifier}</FieldLabel>
            <Input
              autoComplete="off"
              onChange={(event) => onIdentifierChange(event.target.value)}
              placeholder={labels.identifierPlaceholder}
              value={identifier}
            />
            <FieldDescription>{labels.identifierDescription}</FieldDescription>
          </Field>
          {identifierState === 'taken' && existing ? (
            <Alert data-slot="lookup-create-existing" variant="info">
              <AlertDescription>{existing.description}</AlertDescription>
              <AlertAction>
                <Button
                  render={renderLink(existing.href)}
                  size="sm"
                  variant="outline"
                >
                  {labels.openExisting}
                </Button>
              </AlertAction>
            </Alert>
          ) : null}
          {alternatives.length > 0 ? (
            <fieldset
              className="flex flex-col gap-2"
              data-slot="lookup-create-alternatives"
            >
              <legend className="mb-2 text-muted-foreground text-sm">
                {labels.alternatives}
              </legend>
              {alternatives.map((alternative) => (
                <Button
                  className="h-auto justify-between py-2 text-start"
                  key={alternative.id}
                  onClick={() => onAlternative?.(alternative.id)}
                  type="button"
                  variant="outline"
                >
                  <span className="flex flex-col">
                    <span>{alternative.title}</span>
                    <span className="font-normal text-muted-foreground text-xs">
                      {alternative.description}
                    </span>
                  </span>
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              ))}
            </fieldset>
          ) : null}
        </div>
      </RecordDialog>
    )
  }

  const titleMissing = recordTitle.trim() === ''
  const searching = sources.some((source) => source.status === 'running')
  const failed = sources.some((source) => source.status === 'failed')
  const detailsHint = pending
    ? undefined
    : titleMissing
      ? labels.titleRequired
      : searching
        ? labels.createWhileSearching
        : undefined

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      footerStart={
        <Button
          disabled={pending}
          onClick={() => onStepChange('origin')}
          type="button"
          variant="outline"
        >
          {labels.back}
        </Button>
      }
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      open={open}
      step={step}
      submitDisabled={titleMissing}
      submitHint={detailsHint}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={labels.title}
      titleAncestor={labels.ancestor}
    >
      <div className="flex flex-col gap-5">
        {sources.length > 0 ? (
          <StatusRows label={labels.sources} rows={sources} />
        ) : null}
        {failed && onRetry ? (
          <Alert data-slot="lookup-create-failed" variant="error">
            <AlertDescription>{labels.sourcesFailed}</AlertDescription>
            <AlertAction>
              <Button
                onClick={onRetry}
                size="sm"
                type="button"
                variant="outline"
              >
                {labels.retry}
              </Button>
            </AlertAction>
          </Alert>
        ) : null}
        <RecordDialogHeadline
          onTitleChange={onTitleChange}
          title={recordTitle}
          titleLabel={labels.titleField}
          titlePlaceholder={labels.titleField}
        />
        {children}
      </div>
    </RecordDialog>
  )
}
