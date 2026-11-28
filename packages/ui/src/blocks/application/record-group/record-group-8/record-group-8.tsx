'use client'

import { CalendarDotIcon } from '@phosphor-icons/react'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { useMemo } from 'react'
import { defaultRecordGroup8Catalog } from './catalog'
import { resolveRecordGroup8Labels } from './labels'
import type { RecordGroup8Props } from './types'

export function RecordGroup8({
  catalog = defaultRecordGroup8Catalog,
  className,
  labels: labelsProp,
  link,
  onRecordChange,
  record,
}: Readonly<RecordGroup8Props>) {
  const labels = useMemo(
    () => resolveRecordGroup8Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup className={className} title={labels.title} variant="plain">
      <RecordGroupRow label={labels.fields.interest}>
        <SelectProperty
          ariaLabel={labels.fields.interest}
          labels={{ ...labels.select, fallback: labels.noInterest }}
          onValueChange={(interest) => onRecordChange({ interest })}
          options={catalog.interest}
          value={record.interest}
          variant="plain"
        />
      </RecordGroupRow>
      <RecordGroupRow label={labels.fields.urgency}>
        <SelectProperty
          ariaLabel={labels.fields.urgency}
          labels={{ ...labels.select, fallback: labels.noUrgency }}
          onValueChange={(urgency) => onRecordChange({ urgency })}
          options={catalog.urgency}
          value={record.urgency}
          variant="plain"
        />
      </RecordGroupRow>
      {link ? (
        <RecordGroupLink
          href={link.href}
          leading={<CalendarDotIcon aria-hidden />}
          meta={link.meta}
        >
          {link.label}
        </RecordGroupLink>
      ) : null}
    </RecordGroup>
  )
}
