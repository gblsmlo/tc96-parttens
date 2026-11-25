import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog1Labels } from './types'

const plural = (value: number, one: string, many: string) =>
  `${value} ${value === 1 ? one : many}`

export const defaultSettingsCatalog1Labels: SettingsCatalog1Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as tags',
  loading: 'Carregando tags',
  actions: (name) => `Ações de ${name}`,
  addSubtag: 'Adicionar subtag',
  delete: 'Excluir',
  description: 'Organize leads e tarefas com tags e subtags.',
  edit: 'Editar',
  emptyDescription: 'Crie uma tag para organizar leads e tarefas.',
  emptyTitle: 'Nenhuma tag ainda',
  newTag: 'Nova tag',
  subtagOf: (parent) => `Subtag de ${parent}`,
  title: 'Tags',
  usage: (leads, tasks) =>
    `${plural(leads, 'lead', 'leads')} · ${plural(tasks, 'tarefa', 'tarefas')}`,
}
