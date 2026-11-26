import type { ContactDialogLabels } from './contact-types'

export const defaultContactDialogLabels: ContactDialogLabels = {
  cancel: 'Cancelar',
  company: {
    create: (draft) => `Criar empresa "${draft}"`,
    createEmpty: 'Criar nova empresa',
    empty: 'Nenhuma empresa encontrada.',
    list: 'Empresas',
    search: 'Buscar empresa',
    searchPlaceholder: 'Buscar ou criar empresa',
  },
  createMore: 'Criar mais',
  description: 'Descrição',
  descriptionPlaceholder: 'Adicionar descrição...',
  document: 'Documento',
  documentPlaceholder: 'Documento',
  email: {
    add: 'Adicionar e-mail',
    addAnother: 'Adicionar outro',
    duplicate: 'Este e-mail já está na lista.',
    entries: ['Principal', 'Secundário'],
    inputPlaceholder: 'nome@exemplo.com',
    invalid: 'Informe um e-mail válido.',
    remove: 'Remover e-mail',
    removeEntry: (entry) => `Remover ${entry} e-mail`,
    save: 'Salvar',
  },
  more: 'Mais propriedades',
  name: 'Nome',
  namePlaceholder: 'Nome do contato',
  phone: {
    add: 'Adicionar telefone',
    addAnother: 'Adicionar outro',
    country: 'País',
    countryEmpty: 'Nenhum país encontrado.',
    countryList: 'Selecionar país',
    countrySearch: 'Buscar país',
    duplicate: 'Este telefone já está na lista.',
    entries: ['Principal', 'Secundário'],
    invalid: 'Informe um telefone válido.',
    remove: 'Remover telefone',
    removeEntry: (entry) => `Remover ${entry} telefone`,
    required: 'Informe um telefone.',
    save: 'Salvar',
  },
  role: {
    create: (draft) => `Criar cargo "${draft}"`,
    createEmpty: 'Criar novo cargo',
    empty: 'Nenhum cargo encontrado.',
    list: 'Cargos',
    search: 'Buscar cargo',
    searchPlaceholder: 'Buscar ou criar cargo',
  },
  saveFailed: 'Não foi possível criar o contato.',
  stage: 'Etapa',
  submit: 'Criar contato',
  submitting: 'Criando',
  tags: {
    add: 'Adicionar tag',
    count: (count) => `${count} ${count === 1 ? 'tag' : 'tags'}`,
    empty: 'Nenhuma tag encontrada.',
    loading: 'Carregando tags…',
    remove: 'Remover tag',
  },
  tagsPlaceholder: 'Adicionar uma tag',
  title: 'Novo contato',
  titleAncestor: 'Contatos',
}

export function resolveContactDialogLabels(
  labels: Partial<ContactDialogLabels> | undefined,
): ContactDialogLabels {
  const base = defaultContactDialogLabels
  return {
    ...base,
    ...labels,
    company: { ...base.company, ...labels?.company },
    email: { ...base.email, ...labels?.email },
    phone: { ...base.phone, ...labels?.phone },
    role: { ...base.role, ...labels?.role },
    tags: { ...base.tags, ...labels?.tags },
  }
}
