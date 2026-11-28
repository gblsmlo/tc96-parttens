'use client'

import { ArrowsOutSimpleIcon } from '@phosphor-icons/react'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PeopleProperty } from '@tc96/ui/patterns/properties/display/people/people-property'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { RecordPreview } from '@tc96/ui/patterns/records/preview/composition/record-preview/record-preview'
import { RecordPreviewAction } from '@tc96/ui/patterns/records/preview/composition/record-preview-action/record-preview-action'
import { RecordPreviewBody } from '@tc96/ui/patterns/records/preview/composition/record-preview-body/record-preview-body'
import { useMemo } from 'react'
import { useRecordPreviewTimestamp } from '../shared/use-record-preview-timestamp'
import { defaultRecordPreview3Catalog } from './catalog'
import { resolveRecordPreview3Labels } from './labels'
import type { RecordPreview3Props } from './types'

const withoutValueIcon = '[&_[data-slot=property-icon]]:hidden'

export function RecordPreview3({
  catalog = defaultRecordPreview3Catalog,
  className,
  finalFocus,
  kinds,
  labels: labelsProp,
  locale = 'en-US',
  onExpand,
  onOpenChange,
  onRecordChange,
  open,
  people,
  record,
  tags,
  timeZone,
}: Readonly<RecordPreview3Props>) {
  const labels = useMemo(
    () => resolveRecordPreview3Labels(labelsProp),
    [labelsProp],
  )
  const formatTimestamp = useRecordPreviewTimestamp(locale, timeZone)

  return (
    <RecordPreview
      actions={
        onExpand ? (
          <RecordPreviewAction label={labels.expand} onClick={onExpand}>
            <ArrowsOutSimpleIcon aria-hidden />
          </RecordPreviewAction>
        ) : undefined
      }
      className={className}
      closeLabel={labels.close}
      description={record.description ?? undefined}
      finalFocus={finalFocus}
      onOpenChange={onOpenChange}
      open={open}
      title={record.title}
    >
      <RecordPreviewBody>
        <RecordGroup title={labels.groups.properties}>
          <RecordGroupRow label={labels.fields.status}>
            <SelectProperty
              ariaLabel={labels.fields.status}
              labels={labels.select}
              onValueChange={(status) => {
                if (status) onRecordChange({ status })
              }}
              options={catalog.status}
              value={record.status}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.priority}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.priority}
              labels={labels.select}
              onValueChange={(priority) => onRecordChange({ priority })}
              options={catalog.priority}
              placeholder={labels.noPriority}
              value={record.priority}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.kind}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.kind}
              labels={labels.select}
              onValueChange={(kindId) => onRecordChange({ kindId })}
              options={kinds}
              placeholder={labels.noKind}
              value={record.kindId}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.assignees}>
            <PeopleProperty
              ariaLabel={labels.fields.assignees}
              labels={labels.peoplePicker}
              onValueChange={(assigneeIds) => onRecordChange({ assigneeIds })}
              options={people}
              placeholder={labels.unassigned}
              value={record.assigneeIds}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.tags}>
            <TagsProperty
              ariaLabel={labels.fields.tags}
              labels={labels.tagPicker}
              onValueChange={(tagIds) => onRecordChange({ tagIds })}
              options={tags}
              placeholder={labels.tagsPlaceholder}
              value={record.tagIds}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.due}>
            <DateProperty
              ariaLabel={labels.fields.due}
              className={withoutValueIcon}
              isOverdue={record.overdue}
              labels={labels.date}
              locale={locale}
              onValueChange={(dueAt) => onRecordChange({ dueAt })}
              value={record.dueAt}
            />
          </RecordGroupRow>
        </RecordGroup>
        <RecordGroup title={labels.groups.record}>
          <RecordGroupRow label={labels.fields.id}>
            <TextProperty
              ariaLabel={labels.fields.id}
              copyable
              labels={{ copy: labels.copyId }}
              value={record.id}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.updated}>
            <DateProperty
              ariaLabel={labels.fields.updated}
              className={withoutValueIcon}
              displayLabel={formatTimestamp(record.updatedAt)}
              locale={locale}
              readOnly
              value={record.updatedAt}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.creator}>
            <PersonProperty
              ariaLabel={labels.fields.creator}
              options={people}
              placeholder={labels.noCreator}
              readOnly
              value={record.creatorId}
              variant="plain"
            />
          </RecordGroupRow>
        </RecordGroup>
      </RecordPreviewBody>
    </RecordPreview>
  )
}
