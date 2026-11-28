import {
  HandshakeIcon,
  PercentIcon,
  SealCheckIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type {
  RecordGroup9LabelsOverride,
  RecordGroup9Metric,
} from '@tc96/ui/blocks/application/record-group/record-group-9'

export const pipelineMetrics: readonly RecordGroup9Metric[] = [
  {
    icon: UsersIcon,
    id: 'leads',
    label: 'Leads',
    progress: { max: 120, value: 84 },
    target: 'de 120 planejados',
    value: 84,
  },
  { icon: PercentIcon, id: 'conversion', label: 'Conversão', value: '18,5%' },
  {
    icon: SealCheckIcon,
    id: 'success',
    label: 'Sucesso',
    target: 'vendas',
    value: 12,
  },
  {
    icon: HandshakeIcon,
    id: 'negotiation',
    label: 'Em negociação',
    value: 9,
  },
]

export const indicatorLabels: RecordGroup9LabelsOverride = {
  title: 'Indicadores',
}
