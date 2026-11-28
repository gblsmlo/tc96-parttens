'use client'

import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { useMemo } from 'react'
import { defaultRecordGroup3Catalog } from './catalog'
import { resolveRecordGroup3Labels } from './labels'
import type { RecordGroup3Props } from './types'

export function RecordGroup3({
  catalog = defaultRecordGroup3Catalog,
  className,
  labels: labelsProp,
  locale = 'en-US',
  onRecordChange,
  record,
  timeZone = 'UTC',
}: Readonly<RecordGroup3Props>) {
  const labels = useMemo(
    () => resolveRecordGroup3Labels(labelsProp),
    [labelsProp],
  )
  const occupationLabels = useMemo(
    () => ({ ...labels.text, fallback: labels.noOccupation }),
    [labels.noOccupation, labels.text],
  )

  return (
    <RecordGroup className={className} title={labels.title} variant="plain">
      <RecordGroupRow label={labels.fields.birthDate}>
        <DateProperty
          ariaLabel={labels.fields.birthDate}
          labels={labels.date}
          locale={locale}
          onValueChange={(birthDate) => onRecordChange({ birthDate })}
          timeZone={timeZone}
          value={record.birthDate}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.cpf}>
        <TextProperty
          ariaLabel={labels.fields.cpf}
          copyable
          editing="inline"
          labels={{ ...labels.text, copy: labels.copyCpf }}
          onCommit={(cpf) => onRecordChange({ cpf })}
          value={record.cpf}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.occupation}>
        <TextProperty
          ariaLabel={labels.fields.occupation}
          editing="inline"
          labels={occupationLabels}
          onCommit={(occupation) => onRecordChange({ occupation })}
          value={record.occupation}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.source}>
        <SelectProperty
          ariaLabel={labels.fields.source}
          labels={labels.select}
          onValueChange={(source) => onRecordChange({ source })}
          options={catalog.source}
          value={record.source}
          variant="plain"
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}
