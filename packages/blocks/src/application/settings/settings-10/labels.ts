import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings10Labels } from './types'

export const defaultSettings10Labels: Settings10Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as etapas',
  loading: 'Carregando etapas',
  actions: (name) => `Ações de ${name}`,
  cancel: 'Cancelar',
  createStage: 'Criar etapa',
  delete: 'Excluir',
  description: 'Etapas são os passos que um lead percorre, agrupadas por fase',
  dialogAncestor: 'Etapas do funil',
  dialogTitle: 'Nova etapa',
  edit: 'Editar',
  moveDown: 'Mover para baixo',
  moveUp: 'Mover para cima',
  newStage: 'Nova etapa',
  phase: 'Fase',
  stageDescription: (leads, phaseLabel, closed) => {
    const count =
      leads === 0 ? undefined : `${leads} ${leads === 1 ? 'lead' : 'leads'}`
    if (!closed) return count
    const closes = `Fecha como ${phaseLabel.toLowerCase()}`
    return count ? `${count} · ${closes}` : closes
  },
  stageName: 'Nome da etapa',
  title: 'Etapas do funil',
}
