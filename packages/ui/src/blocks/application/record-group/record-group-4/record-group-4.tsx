'use client'

import { ClipboardTextIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { RecordStatusBadge } from '@tc96/ui/patterns/records/group/composition/record-status-badge/record-status-badge'
import { RecordPreview } from '@tc96/ui/patterns/records/preview/composition/record-preview/record-preview'
import { useMemo } from 'react'
import { defaultRecordGroup4Catalog } from './catalog'
import { resolveRecordGroup4Labels } from './labels'
import type {
  RecordGroup4Changes,
  RecordGroup4Field,
  RecordGroup4Props,
  RecordGroup4Values,
} from './types'

const fields = [
  { catalogKey: 'objective', key: 'primaryObjective' },
  { catalogKey: 'objective', key: 'secondaryObjective' },
  { catalogKey: 'target', key: 'expectedTarget' },
] as const

const sameValues = (a: RecordGroup4Values, b: RecordGroup4Values) =>
  fields.every(({ key }) => a[key] === b[key])

const change = (
  key: RecordGroup4Field,
  value: string | null,
): RecordGroup4Changes => ({ [key]: value })

export function RecordGroup4({
  catalog = defaultRecordGroup4Catalog,
  className,
  finalFocus,
  labels: labelsProp,
  onOpenChange,
  onPublish,
  onSaveDraft,
  onValuesChange,
  open,
  values,
  versions,
}: Readonly<RecordGroup4Props>) {
  const labels = useMemo(
    () => resolveRecordGroup4Labels(labelsProp),
    [labelsProp],
  )
  const head = versions[0]

  if (!head) return null

  const dirty = !sameValues(values, head.values)
  const headStatus = catalog.status[head.status]
  const status = dirty
    ? labels.unsaved
    : head.status === 'draft'
      ? labels.draftSaved(head.savedAt)
      : labels.published(head.number, head.savedAt)

  return (
    <>
      <RecordGroup className={className} title={labels.title} variant="plain">
        <RecordGroupLink
          leading={<ClipboardTextIcon aria-hidden />}
          meta={
            <RecordStatusBadge color={headStatus.color}>
              {headStatus.label}
            </RecordStatusBadge>
          }
          onClick={() => onOpenChange(true)}
          render={<button type="button" />}
        >
          {labels.title}
        </RecordGroupLink>
      </RecordGroup>
      <RecordPreview
        closeLabel={labels.close}
        description={<span aria-live="polite">{status}</span>}
        finalFocus={finalFocus}
        footer={
          <>
            <Button disabled={!dirty} onClick={onSaveDraft} variant="outline">
              {labels.saveDraft}
            </Button>
            <Button
              disabled={!dirty && head.status === 'published'}
              onClick={onPublish}
            >
              {labels.publish}
            </Button>
          </>
        }
        onOpenChange={onOpenChange}
        open={open}
        title={labels.title}
      >
        {fields.map(({ catalogKey, key }) => (
          <RecordGroupRow key={key} label={labels.fields[key]}>
            <SelectProperty
              ariaLabel={labels.fields[key]}
              labels={{ ...labels.select, fallback: labels.empty[key] }}
              onValueChange={(value) => onValuesChange(change(key, value))}
              options={catalog[catalogKey]}
              value={values[key]}
              variant="plain"
            />
          </RecordGroupRow>
        ))}
      </RecordPreview>
    </>
  )
}
