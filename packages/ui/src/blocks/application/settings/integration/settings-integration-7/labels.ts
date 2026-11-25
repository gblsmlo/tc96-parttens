import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration7Labels } from './types'

export const defaultSettingsIntegration7Labels: SettingsIntegration7Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os conectores',
  loading: 'Carregando conectores',
  action: (name, actionLabel) => `${actionLabel} ${name}`,
  available: 'Disponível',
  build: 'Criar conector',
  connected: 'Conectado',
  description: 'Configure os conectores ou instale novos para o seu espaço.',
  emptyDescription: 'Os conectores disponíveis aparecem aqui.',
  emptyTitle: 'Nenhum conector disponível',
  preview: 'Prévia',
  title: 'Conectores',
}
