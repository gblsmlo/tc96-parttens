'use client'

import { ArrowsOutSimpleIcon } from '@phosphor-icons/react'
import { createAmountFormatter } from '@tc96/ui/helpers/format'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
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
import { defaultRecordPreview4Catalog } from './catalog'
import { resolveRecordPreview4Labels } from './labels'
import type { RecordPreview4Props } from './types'

const withoutValueIcon = '[&_[data-slot=property-icon]]:hidden'

function partiesLabel(names: readonly string[]) {
  const [first] = names
  if (!first) return null
  return names.length > 1 ? `${first} +${names.length - 1}` : first
}

export function RecordPreview4({
  catalog = defaultRecordPreview4Catalog,
  className,
  contracts,
  courts,
  currency = 'BRL',
  finalFocus,
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
}: Readonly<RecordPreview4Props>) {
  const labels = useMemo(
    () => resolveRecordPreview4Labels(labelsProp),
    [labelsProp],
  )
  const formatTimestamp = useRecordPreviewTimestamp(locale, timeZone)
  const amount = useMemo(
    () => createAmountFormatter({ currency, locale }),
    [currency, locale],
  )

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
          <RecordGroupRow label={labels.fields.plaintiff}>
            <TextProperty
              ariaLabel={labels.fields.plaintiff}
              labels={{ fallback: labels.notInformed }}
              value={partiesLabel(record.plaintiffs)}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.defendant}>
            <TextProperty
              ariaLabel={labels.fields.defendant}
              labels={{ fallback: labels.notInformed }}
              value={partiesLabel(record.defendants)}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.caseNumber}>
            <TextProperty
              ariaLabel={labels.fields.caseNumber}
              copyable
              labels={{
                ...labels.text,
                copy: labels.copyNumber,
                fallback: labels.noNumber,
                inputPlaceholder: labels.caseNumberPlaceholder,
              }}
              onCommit={(caseNumber) => onRecordChange({ caseNumber })}
              value={record.caseNumber}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.phase}>
            <SelectProperty
              ariaLabel={labels.fields.phase}
              labels={labels.select}
              onValueChange={(phaseId) => onRecordChange({ phaseId })}
              options={catalog.phase}
              placeholder={labels.noPhase}
              value={record.phaseId}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.contract}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.contract}
              labels={labels.select}
              onValueChange={(contractId) => onRecordChange({ contractId })}
              options={contracts}
              placeholder={labels.noContract}
              value={record.contractId}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.responsible}>
            <PersonProperty
              ariaLabel={labels.fields.responsible}
              onValueChange={(responsibleId) =>
                onRecordChange({ responsibleId })
              }
              options={people}
              placeholder={labels.noResponsible}
              value={record.responsibleId}
              variant="plain"
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
              variant="plain"
            />
          </RecordGroupRow>
        </RecordGroup>
        <RecordGroup title={labels.groups.lawsuit}>
          <RecordGroupRow label={labels.fields.justice}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.justice}
              labels={labels.select}
              onValueChange={(justice) => onRecordChange({ justice })}
              options={catalog.justice}
              placeholder={labels.noJustice}
              value={record.justice}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.smallClaims}>
            <SelectProperty
              ariaLabel={labels.fields.smallClaims}
              labels={labels.select}
              onValueChange={(value) =>
                onRecordChange({ smallClaims: value === 'yes' })
              }
              options={catalog.smallClaims}
              value={record.smallClaims ? 'yes' : 'no'}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.court}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.court}
              labels={labels.select}
              onValueChange={(courtSlug) => onRecordChange({ courtSlug })}
              options={courts}
              placeholder={labels.noCourt}
              value={record.courtSlug}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.division}>
            <TextProperty
              ariaLabel={labels.fields.division}
              labels={{ ...labels.text, fallback: labels.noDivision }}
              onCommit={(courtDivision) => onRecordChange({ courtDivision })}
              value={record.courtDivision}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.venue}>
            <TextProperty
              ariaLabel={labels.fields.venue}
              labels={{ ...labels.text, fallback: labels.noVenue }}
              onCommit={(courtVenue) => onRecordChange({ courtVenue })}
              value={record.courtVenue}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.actionClass}>
            <TextProperty
              ariaLabel={labels.fields.actionClass}
              labels={{ ...labels.text, fallback: labels.noAction }}
              onCommit={(actionClass) => onRecordChange({ actionClass })}
              value={record.actionClass}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.subject}>
            <TextProperty
              ariaLabel={labels.fields.subject}
              labels={{ ...labels.text, fallback: labels.noSubject }}
              onCommit={(subject) => onRecordChange({ subject })}
              value={record.subject}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.instance}>
            <SelectProperty
              allowEmpty
              ariaLabel={labels.fields.instance}
              labels={labels.select}
              onValueChange={(instance) => onRecordChange({ instance })}
              options={catalog.instance}
              placeholder={labels.noInstance}
              value={record.instance}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label={labels.fields.claimAmount}>
            <TextProperty
              ariaLabel={labels.fields.claimAmount}
              labels={{ fallback: labels.noAmount }}
              value={
                record.claimAmountCents === null
                  ? null
                  : amount.format(record.claimAmountCents / 100)
              }
              variant="plain"
            />
          </RecordGroupRow>
        </RecordGroup>
        <RecordGroup defaultOpen={false} title={labels.groups.record}>
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
        </RecordGroup>
      </RecordPreviewBody>
    </RecordPreview>
  )
}
