import {
  CircleIcon,
  HandshakeIcon,
  ProhibitInsetIcon,
  RadioButtonIcon,
} from '@phosphor-icons/react'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import type { RecordDialog4Labels, RecordDialog4Tag } from './types'

export function createRecordDialog4StageOptions(
  labels: RecordDialog4Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: CircleIcon,
      label: labels.stageNone,
      tone: 'neutral',
      value: 'none',
    },
    {
      icon: RadioButtonIcon,
      label: labels.stageQualified,
      tone: 'info',
      value: 'qualified',
    },
    {
      icon: HandshakeIcon,
      label: labels.stageCustomer,
      tone: 'success',
      value: 'customer',
    },
    {
      icon: ProhibitInsetIcon,
      label: labels.stageInactive,
      tone: 'warning',
      value: 'inactive',
    },
  ]
}

export function createRecordDialog4DocumentTypeOptions(
  labels: RecordDialog4Labels,
): readonly PropertyOption[] {
  return [
    { label: labels.documentTypeCpf, value: 'cpf' },
    { label: labels.documentTypeCnpj, value: 'cnpj' },
  ]
}

export const defaultRecordDialog4TagOptions: readonly PropertyOption<RecordDialog4Tag>[] =
  [
    { label: 'Decisor', value: 'decision-maker' },
    { label: 'Indicação', value: 'referral' },
    { label: 'Evento', value: 'event' },
    { label: 'Newsletter', value: 'newsletter' },
    { label: 'VIP', value: 'vip' },
  ]
