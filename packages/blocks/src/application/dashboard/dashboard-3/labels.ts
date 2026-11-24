import type { Dashboard3Labels } from './types'

export const defaultDashboard3Labels: Dashboard3Labels = {
  action: 'Resolver',
  actionFor: (action, title) => `${action}: ${title}`,
  breadcrumb: 'Navegação estrutural',
  columnCoverage: 'Cobertura',
  columnMember: 'Equipe',
  columnRole: 'Função',
  columnShift: 'Turno',
  columnStatus: 'Status',
  coverageOf: (name) => `Cobertura de ${name}`,
  crewTitle: 'Equipe do turno',
  description: 'Quem está escalado, o que falta cobrir e o que fazer agora.',
  emptyDescription: 'A cobertura aparece aqui assim que houver escalas.',
  emptyTitle: 'Nenhuma escala cadastrada',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar a cobertura',
  export: 'Exportar',
  forecastLabel: 'Oferta de pessoal e demanda prevista ao longo do dia',
  forecastSeries: 'Previsão',
  forecastSummary: (items) =>
    items
      .map(
        (item) =>
          `${item.label}: oferta ${item.supply}, previsão ${item.forecast}`,
      )
      .join('; '),
  forecastTitle: 'Oferta e previsão',
  indicators: 'Indicadores',
  loading: 'Carregando cobertura das equipes',
  nextPage: 'Próxima página',
  noCrew: 'Nenhuma pessoa escalada',
  noQueue: 'Nenhuma ação pendente',
  pageOf: (page, pageCount) => `Página ${page} de ${pageCount}`,
  pagination: 'Paginação da equipe',
  period: 'Período',
  previousPage: 'Página anterior',
  queueTitle: 'Fila de ações',
  retry: 'Tentar novamente',
  search: 'Buscar pessoa',
  supplySeries: 'Oferta',
  title: 'Cobertura das equipes',
}
