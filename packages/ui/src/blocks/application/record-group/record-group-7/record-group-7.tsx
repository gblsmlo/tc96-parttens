'use client'

import { Button } from '@tc96/ui/button'
import { formatNumericDate, parseIsoDate } from '@tc96/ui/helpers/date'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { useMemo } from 'react'
import { defaultRecordGroup7Catalog } from './catalog'
import { resolveRecordGroup7Labels } from './labels'
import type { RecordGroup7Props } from './types'

export function RecordGroup7({
  catalog = defaultRecordGroup7Catalog,
  className,
  labels: labelsProp,
  locale = 'en-US',
  onIssue,
  onMethodChange,
  record,
  timeZone,
}: Readonly<RecordGroup7Props>) {
  const labels = useMemo(
    () => resolveRecordGroup7Labels(labelsProp),
    [labelsProp],
  )
  const issuedDate = parseIsoDate(record.issuedAt)
  const issued = issuedDate !== null

  return (
    <RecordGroup
      actions={
        <Button
          disabled={record.method === null}
          onClick={onIssue}
          size="sm"
          variant="secondary"
        >
          {issued ? labels.reissue : labels.issue}
        </Button>
      }
      className={className}
      title={labels.title}
      variant="plain"
    >
      <RecordGroupRow label={labels.fields.method}>
        <SelectProperty
          ariaLabel={labels.fields.method}
          labels={{ ...labels.select, fallback: labels.noMethod }}
          onValueChange={onMethodChange}
          options={catalog.method}
          value={record.method}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.dueAt}>
        <DateProperty
          ariaLabel={labels.fields.dueAt}
          labels={labels.date}
          locale={locale}
          readOnly
          timeZone={timeZone}
          value={record.dueAt}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.issuedAt}>
        <TextProperty
          ariaLabel={labels.fields.issuedAt}
          labels={{ fallback: labels.notIssued }}
          value={
            issuedDate
              ? labels.issuedOn(formatNumericDate(issuedDate, locale, timeZone))
              : null
          }
          variant="plain"
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}
