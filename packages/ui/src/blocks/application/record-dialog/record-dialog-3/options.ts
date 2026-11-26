import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { RecordDialog3Labels } from './types'

export function createRecordDialog3StageOptions(
  labels: RecordDialog3Labels,
): readonly PropertyOption[] {
  return [
    { label: labels.stageNew, value: 'new' },
    { label: labels.stageContacted, value: 'contacted' },
    { label: labels.stageQualified, value: 'qualified' },
  ]
}

export function createRecordDialog3SourceOptions(
  labels: RecordDialog3Labels,
): readonly PropertyOption[] {
  return [
    { label: labels.sourceReferral, value: 'referral' },
    { label: labels.sourceWebsite, value: 'website' },
    { label: labels.sourceAds, value: 'ads' },
    { label: labels.sourceEvent, value: 'event' },
    { label: labels.sourceOutbound, value: 'outbound' },
  ]
}

export function createRecordDialog3NextActionOptions(
  labels: RecordDialog3Labels,
): readonly PropertyOption[] {
  return [
    { label: labels.nextActionCall, value: 'call' },
    { label: labels.nextActionEmail, value: 'email' },
    { label: labels.nextActionMeeting, value: 'meeting' },
    { label: labels.nextActionProposal, value: 'proposal' },
    { label: labels.nextActionFollowUp, value: 'follow-up' },
  ]
}
