'use client'

import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { RecordStatusBadge } from '@tc96/ui/patterns/records/group/composition/record-status-badge/record-status-badge'
import { RecordPreview } from '@tc96/ui/patterns/records/preview/composition/record-preview/record-preview'
import { useMemo, useState } from 'react'
import { defaultRecordGroup5Catalog } from './catalog'
import { resolveRecordGroup5Labels } from './labels'
import type { RecordGroup5Props } from './types'

const fields = [
  { catalogKey: 'objective', key: 'primaryObjective' },
  { catalogKey: 'objective', key: 'secondaryObjective' },
  { catalogKey: 'target', key: 'expectedTarget' },
] as const

export function RecordGroup5({
  catalog = defaultRecordGroup5Catalog,
  className,
  finalFocus,
  labels: labelsProp,
  onOpenVersionChange,
  openVersion,
  versions,
}: Readonly<RecordGroup5Props>) {
  const labels = useMemo(
    () => resolveRecordGroup5Labels(labelsProp),
    [labelsProp],
  )
  const [shownVersion, setShownVersion] = useState(openVersion)

  if (openVersion !== null && openVersion !== shownVersion) {
    setShownVersion(openVersion)
  }

  const previewed = versions.find((version) => version.number === shownVersion)

  return (
    <>
      <RecordGroup className={className} title={labels.title} variant="plain">
        {versions.map((version) => {
          const status = catalog.status[version.status]

          return (
            <RecordGroupLink
              key={version.number}
              leading={<ClockCounterClockwiseIcon aria-hidden />}
              meta={
                <RecordStatusBadge color={status.color}>
                  {status.label}
                </RecordStatusBadge>
              }
              onClick={() => onOpenVersionChange(version.number)}
              render={<button type="button" />}
            >
              {labels.version(version.number)}
            </RecordGroupLink>
          )
        })}
      </RecordGroup>
      {previewed ? (
        <RecordPreview
          closeLabel={labels.close}
          description={
            previewed.status === 'draft'
              ? labels.draftSaved(previewed.savedAt)
              : labels.publishedOn(previewed.savedAt)
          }
          finalFocus={finalFocus}
          onOpenChange={(open) => {
            if (!open) onOpenVersionChange(null)
          }}
          open={openVersion !== null}
          title={labels.version(previewed.number)}
        >
          {fields.map(({ catalogKey, key }) => (
            <RecordGroupRow key={key} label={labels.fields[key]}>
              <SelectProperty
                ariaLabel={labels.fieldOfVersion(
                  labels.fields[key],
                  previewed.number,
                )}
                labels={{ ...labels.select, fallback: labels.empty[key] }}
                options={catalog[catalogKey]}
                readOnly
                value={previewed.values[key]}
                variant="plain"
              />
            </RecordGroupRow>
          ))}
        </RecordPreview>
      ) : null}
    </>
  )
}
