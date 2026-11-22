import {
  RecordGroup,
  RecordGroupMetric,
  RecordGroupMetrics,
  type RecordGroupMetricsColumns,
} from '@tc96/parttens'
import {
  BadgeCheckIcon,
  HandshakeIcon,
  PercentIcon,
  UsersIcon,
} from 'lucide-react'

export function IndicatorsGroup({
  columns = 2,
}: Readonly<{ columns?: RecordGroupMetricsColumns }>) {
  const leads = 84
  const plannedLeads = 120

  return (
    <RecordGroup title="Indicadores">
      <RecordGroupMetrics columns={columns}>
        <RecordGroupMetric
          icon={<UsersIcon aria-hidden />}
          label="Leads"
          progress={leads / plannedLeads}
          target={`de ${plannedLeads} planejados`}
          value={leads}
        />
        <RecordGroupMetric
          icon={<PercentIcon aria-hidden />}
          label="Conversão"
          value="18,5%"
        />
        <RecordGroupMetric
          icon={<BadgeCheckIcon aria-hidden />}
          label="Sucesso"
          target="vendas"
          value={12}
        />
        <RecordGroupMetric
          icon={<HandshakeIcon aria-hidden />}
          label="Em negociação"
          value={9}
        />
      </RecordGroupMetrics>
    </RecordGroup>
  )
}
