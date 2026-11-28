import {
  CalendarPlusIcon,
  EnvelopeSimpleIcon,
  SignatureIcon,
  TargetIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import type {
  RecordGroup2LabelsOverride,
  RecordGroup2Trigger,
} from '@tc96/ui/blocks/application/record-group/record-group-2'

export const recordTriggers: readonly RecordGroup2Trigger[] = [
  { icon: SignatureIcon, id: 'contract', label: 'Gerar contrato' },
  { icon: EnvelopeSimpleIcon, id: 'documents', label: 'Solicitar documentos' },
  { icon: CalendarPlusIcon, id: 'appointment', label: 'Agendar consulta' },
  { icon: UserPlusIcon, id: 'contact', label: 'Criar contato' },
  { icon: TargetIcon, id: 'lead', label: 'Criar Lead' },
]

export const triggerLabels: RecordGroup2LabelsOverride = { title: 'Ações' }
