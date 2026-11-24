import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings23Labels } from './types'

export const defaultSettings23Labels: Settings23Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a cobrança',
  loading: 'Carregando cobrança',
  changePlan: 'Alterar plano',
  columnActions: 'Ações',
  columnAmount: 'Valor',
  columnDate: 'Data',
  columnStatus: 'Status',
  download: (date) => `Baixar fatura de ${date}`,
  emptyDescription: 'As faturas aparecem aqui depois da primeira cobrança.',
  emptyTitle: 'Nenhuma fatura ainda',
  invoicesDescription: 'Histórico de cobranças da assinatura.',
  invoicesTitle: 'Faturas',
  perMonth: 'por mês',
  planTitle: 'Plano atual',
  renewsOn: (date) => `Renova em ${date}`,
  statuses: { failed: 'Falhou', paid: 'Paga', pending: 'Pendente' },
  title: 'Cobrança',
  usage: (used, limit, unit) => `${used} de ${limit}${unit ? ` ${unit}` : ''}`,
  usageTitle: 'Uso do plano',
}
