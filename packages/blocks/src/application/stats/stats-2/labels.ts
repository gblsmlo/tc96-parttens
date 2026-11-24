import type { Stats2Labels } from './types'

export const defaultStats2Labels: Stats2Labels = {
  billed: 'Cobrado neste ciclo',
  quota: 'Uso da cota',
  renewsOn: (date) => `Renova em ${date}`,
  title: 'Uso da API',
  upgrade: 'Fazer upgrade',
  usage: (used, limit) => `${used} de ${limit} requisições`,
}
