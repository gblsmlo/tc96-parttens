import type {
  Navbar7Crumb,
  Navbar7Range,
  Navbar7RefreshOption,
  Navbar7SearchItem,
} from '@tc96/ui/blocks/application/navbar/navbar-7'

export const breadcrumb: Navbar7Crumb[] = [
  { href: '/analises', id: 'analytics', label: 'Análises' },
  { id: 'growth', label: 'Visão de crescimento' },
]

export const refreshOptions: Navbar7RefreshOption[] = [
  { id: 'off', label: 'Desligado' },
  { id: '30s', label: '30 s' },
  { id: '1m', label: '1 min' },
  { id: '5m', label: '5 min' },
]

export const searchItems: Navbar7SearchItem[] = [
  { group: 'Relatórios', id: 'growth', label: 'Visão de crescimento' },
  { group: 'Relatórios', id: 'retention', label: 'Retenção de clientes' },
  { group: 'Relatórios', id: 'funnel', label: 'Funil de conversão' },
  { group: 'Ações', id: 'export', label: 'Exportar dados em CSV' },
  { group: 'Ações', id: 'schedule', label: 'Agendar envio por e-mail' },
]

export const novemberRange: Navbar7Range = {
  from: new Date(2026, 10, 1),
  to: new Date(2026, 10, 30),
}
