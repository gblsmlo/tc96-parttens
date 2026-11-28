'use client'

import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { useMemo } from 'react'
import { resolveRecordGroup2Labels } from './labels'
import type { RecordGroup2Props } from './types'

export function RecordGroup2({
  className,
  labels: labelsProp,
  onRun,
  runningId = null,
  triggers,
}: Readonly<RecordGroup2Props>) {
  const labels = useMemo(
    () => resolveRecordGroup2Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup className={className} title={labels.title} variant="plain">
      {triggers.map(({ icon: Icon, id, label }) => (
        <RecordGroupLink
          aria-busy={runningId === id}
          key={id}
          leading={<Icon aria-hidden />}
          onClick={() => onRun(id)}
          render={<button type="button" />}
        >
          {label}
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}
