import type {
  Dashboard1Pagination,
  Dashboard1RowAction,
} from '@tc96/ui/blocks/application/dashboard/dashboard-1'

export const periodOptions = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Últimos 30 dias', value: '30d' },
  { label: 'Este trimestre', value: 'quarter' },
]

export const initialPeriod = '7d'

export const breadcrumbsFor = (page: string) => [
  { href: '/', label: 'Início' },
  { href: '/painel', label: 'Painéis' },
  { label: page },
]

export const rowActions: Dashboard1RowAction[] = [
  { id: 'view', label: 'Ver detalhes' },
  { id: 'notify', label: 'Notificar responsável' },
  { destructive: true, id: 'escalate', label: 'Escalar' },
]

export const matchesSearch = (search: string, ...fields: string[]) => {
  const query = search.trim().toLocaleLowerCase('pt-BR')
  return (
    query === '' ||
    fields.some((field) => field.toLocaleLowerCase('pt-BR').includes(query))
  )
}

export const paginate = <Row>(
  rows: Row[],
  page: number,
  pageSize: number,
): { pagination: Dashboard1Pagination; rows: Row[] } => {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)
  return {
    pagination: { page: current, pageCount },
    rows: rows.slice((current - 1) * pageSize, current * pageSize),
  }
}
