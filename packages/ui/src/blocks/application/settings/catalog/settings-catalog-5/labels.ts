import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog5Labels } from './types'

export const defaultSettingsCatalog5Labels: SettingsCatalog5Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os status',
  loading: 'Carregando status',
  actions: (name) => `Ações de ${name}`,
  delete: 'Excluir',
  description:
    'Os status definem o fluxo que os projetos percorrem do início à conclusão',
  edit: 'Editar',
  newStatus: 'Novo status',
  projects: (count) => `${count} ${count === 1 ? 'projeto' : 'projetos'}`,
  title: 'Status de projetos',
}
