'use client'

import { Checklist } from '@tc96/ui/patterns/checklist/composition/checklist/checklist'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { useMemo } from 'react'
import { resolveRecordGroup1Labels } from './labels'
import type { RecordGroup1Props } from './types'

export function RecordGroup1({
  className,
  items,
  labels: labelsProp,
  locale = 'en-US',
  newItemTitle,
  onCreate,
  onItemCompletionChange,
  onItemDelete,
  onItemMove,
  onItemRename,
  onNewItemTitleChange,
}: Readonly<RecordGroup1Props>) {
  const labels = useMemo(
    () => resolveRecordGroup1Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup className={className} title={labels.title} variant="inset">
      <Checklist
        addLabel={labels.addLabel}
        ariaLabel={labels.checklist}
        items={items}
        locale={locale}
        newItemTitle={newItemTitle}
        onCreate={onCreate}
        onItemCompletionChange={onItemCompletionChange}
        onItemDelete={onItemDelete}
        onItemMove={onItemMove}
        onItemRename={onItemRename}
        onNewItemTitleChange={onNewItemTitleChange}
        variant="plain"
      />
    </RecordGroup>
  )
}
