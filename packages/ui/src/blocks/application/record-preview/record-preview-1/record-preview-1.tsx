'use client'

import { ArrowsOutSimpleIcon } from '@phosphor-icons/react'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { ScheduleProperty } from '@tc96/ui/patterns/properties/display/schedule/schedule-property'
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
import { defaultRecordPreview1Catalog } from './catalog'
import { resolveRecordPreview1Labels } from './labels'
import type { RecordPreview1Props } from './types'

const withoutValueIcon = '[&_[data-slot=property-icon]]:hidden'

export function RecordPreview1({
  catalog = defaultRecordPreview1Catalog,
  className,
  finalFocus,
  labels: labelsProp,
  locale = 'en-US',
  onExpand,
  onOpenChange,
  onRecordChange,
  open,
  people,
  record,
  timeZone,
  today,
}: Readonly<RecordPreview1Props>) {
  const labels = useMemo(
    () => resolveRecordPreview1Labels(labelsProp),
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
              onValueChange={(status) => onRecordChange({ status })}
              options={catalog.status}
              value={record.status}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.priority}>
            <SelectProperty
              ariaLabel={labels.fields.priority}
              labels={labels.select}
              onValueChange={(priority) => onRecordChange({ priority })}
              options={catalog.priority}
              value={record.priority}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.type}>
            <SelectProperty
              ariaLabel={labels.fields.type}
              labels={labels.select}
              onValueChange={(type) => onRecordChange({ type })}
              options={catalog.type}
              value={record.type}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.tags}>
            <TagsProperty
              ariaLabel={labels.fields.tags}
              labels={labels.tagPicker}
              onValueChange={(tags) => onRecordChange({ tags })}
              options={catalog.tags}
              placeholder={labels.tagsPlaceholder}
              value={record.tags}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.assignee}>
            <PersonProperty
              ariaLabel={labels.fields.assignee}
              onValueChange={(assignee) => onRecordChange({ assignee })}
              options={people}
              placeholder={labels.noAssignee}
              value={record.assignee}
            />
          </RecordGroupRow>
        </RecordGroup>
        <RecordGroup title={labels.groups.schedule}>
          <RecordGroupRow label={labels.fields.schedule}>
            <ScheduleProperty
              ariaLabel={labels.fields.schedule}
              className={withoutValueIcon}
              labels={labels.schedule}
              locale={locale}
              onValueChange={(schedule) => onRecordChange({ schedule })}
              today={today}
              value={record.schedule}
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.due}>
            <DateProperty
              allowClear={false}
              ariaLabel={labels.fields.due}
              className={withoutValueIcon}
              labels={labels.date}
              locale={locale}
              onValueChange={(due) => onRecordChange({ due })}
              value={record.due}
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
          <RecordGroupRow label={labels.fields.createdAt}>
            <DateProperty
              ariaLabel={labels.fields.createdAt}
              className={withoutValueIcon}
              displayLabel={formatTimestamp(record.createdAt)}
              locale={locale}
              readOnly
              value={record.createdAt}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.updatedAt}>
            <DateProperty
              ariaLabel={labels.fields.updatedAt}
              className={withoutValueIcon}
              displayLabel={formatTimestamp(record.updatedAt)}
              locale={locale}
              readOnly
              value={record.updatedAt}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.createdBy}>
            <PersonProperty
              ariaLabel={labels.fields.createdBy}
              options={people}
              placeholder={labels.noCreator}
              readOnly
              value={record.createdBy}
              variant="plain"
            />
          </RecordGroupRow>
        </RecordGroup>
      </RecordPreviewBody>
    </RecordPreview>
  )
}
