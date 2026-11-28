import type {
  RecordGroup10Entry,
  RecordGroup10LabelsOverride,
} from '@tc96/ui/blocks/application/record-group/record-group-10'

const gabriel = { initials: 'G', name: 'Gabriel Melo' }

export const activityEntries: readonly RecordGroup10Entry[] = [
  {
    actor: gabriel,
    at: '2026-09-09T14:20',
    id: 'company',
    object: 'PayPal',
    preposition: 'para',
    subject: 'Empresa',
    timeLabel: 'há 1 mês',
    verb: 'alterou',
  },
  {
    actor: gabriel,
    at: '2026-09-09T14:18',
    id: 'attributes',
    subject: '2 atributos',
    timeLabel: 'há 1 mês',
    verb: 'alterou',
  },
  {
    actor: gabriel,
    at: '2026-09-09T14:15',
    id: 'created',
    subject: 'Pessoa',
    timeLabel: 'há 1 mês',
    verb: 'criou',
  },
]

export const activityLabels: RecordGroup10LabelsOverride = {
  title: 'Atividade',
  viewAll: 'Ver tudo',
}
