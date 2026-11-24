import type { Settings19Labels } from './types'

export const defaultSettings19Labels: Settings19Labels = {
  actions: (url) => `Ações de ${url}`,
  delete: 'Excluir',
  description: 'Receba eventos do workspace em URLs que você controla.',
  edit: 'Editar',
  emptyDescription: 'Crie um endpoint para receber eventos por HTTP.',
  emptyTitle: 'Nenhum endpoint ainda',
  enable: (url) => `Ativar ${url}`,
  eventCount: (count) => `${count} ${count === 1 ? 'evento' : 'eventos'}`,
  failing: 'Falhando',
  failingDescription: (count) =>
    count === 1
      ? 'Um endpoint não está recebendo as entregas.'
      : `${count} endpoints não estão recebendo as entregas.`,
  failingTitle: 'Entregas com falha',
  lastDelivery: (value) => `Última entrega ${value}`,
  newEndpoint: 'Novo endpoint',
  sendTest: 'Enviar teste',
  title: 'Webhooks',
}
