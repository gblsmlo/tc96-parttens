import type { Settings11Labels } from './types'

export const defaultSettings11Labels: Settings11Labels = {
  actions: (name) => `Ações de ${name}`,
  delete: 'Excluir',
  description:
    'Os status definem o fluxo que os projetos percorrem do início à conclusão',
  edit: 'Editar',
  newStatus: 'Novo status',
  projects: (count) => `${count} ${count === 1 ? 'projeto' : 'projetos'}`,
  title: 'Status de projetos',
}
