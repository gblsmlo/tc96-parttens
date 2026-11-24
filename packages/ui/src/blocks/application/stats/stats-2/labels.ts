import { defaultStatsLoadLabels } from '../shared/labels'
import type { Stats2Labels } from './types'

export const defaultStats2Labels: Stats2Labels = {
  ...defaultStatsLoadLabels,
  errorTitle: 'Não foi possível carregar o uso da API',
  loading: 'Carregando uso da API',
  billed: 'Cobrado neste ciclo',
  quota: 'Uso da cota',
  renewsOn: (date) => `Renova em ${date}`,
  title: 'Uso da API',
  upgrade: 'Fazer upgrade',
  usage: (used, limit) => `${used} de ${limit} requisições`,
}
