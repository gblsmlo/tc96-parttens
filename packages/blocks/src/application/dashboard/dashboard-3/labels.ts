import type { Dashboard3Labels } from './types'

export const defaultDashboard3Labels: Dashboard3Labels = {
  action: 'Resolver',
  actionFor: (action, title) => `${action}: ${title}`,
  columnCoverage: 'Cobertura',
  columnMember: 'Equipe',
  columnRole: 'Função',
  columnShift: 'Turno',
  columnStatus: 'Status',
  coverageOf: (name) => `Cobertura de ${name}`,
  crewTitle: 'Equipe do turno',
  emptyDescription: 'A cobertura aparece aqui assim que houver escalas.',
  emptyTitle: 'Nenhuma escala cadastrada',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar a cobertura',
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
  loading: 'Carregando cobertura das equipes',
  noCrew: 'Nenhuma pessoa escalada',
  noQueue: 'Nenhuma ação pendente',
  queueTitle: 'Fila de ações',
  retry: 'Tentar novamente',
  supplySeries: 'Oferta',
  title: 'Cobertura das equipes',
}
