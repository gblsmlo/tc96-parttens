import type { CollectionDefinition } from '@tc96/parttens'
import { BookmarkIcon, FileTextIcon, NotebookPenIcon } from 'lucide-react'
import { NOW, peopleById } from './tasks'

export type DocumentKind = 'note' | 'document' | 'bookmark'

export interface DocumentRecord {
  archived: boolean
  excerpt: string
  id: string
  kind: DocumentKind
  createdAt: string
  ownerId: string
  pinned: boolean
  title: string
}

export const kindOptions = [
  { color: '#d97706', icon: NotebookPenIcon, label: 'Nota', value: 'note' },
  {
    color: '#2563eb',
    icon: FileTextIcon,
    label: 'Documento',
    value: 'document',
  },
  {
    color: '#059669',
    icon: BookmarkIcon,
    label: 'Bookmark',
    value: 'bookmark',
  },
] as const satisfies readonly {
  color: string
  icon: typeof FileTextIcon
  label: string
  value: DocumentKind
}[]

export const kindOptionOf = (kind: DocumentKind) =>
  kindOptions.find((option) => option.value === kind) ?? kindOptions[0]

const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 60 * 60 * 1000).toISOString()

export const initialDocuments: readonly DocumentRecord[] = [
  {
    archived: false,
    excerpt:
      'Personas de gestor e analista, com as histórias de acompanhamento de metas e alertas de desvio.',
    id: 'indicators-stories',
    kind: 'document',
    createdAt: hoursAgo(2),
    ownerId: 'ana',
    pinned: true,
    title: 'Personas e histórias de indicadores',
  },
  {
    archived: false,
    excerpt:
      'Fila de publicação, revisão por pares e o contrato do serviço de agendamento.',
    id: 'publishing-architecture',
    kind: 'document',
    createdAt: hoursAgo(16),
    ownerId: 'bruno',
    pinned: true,
    title: 'Plano técnico de publicações',
  },
  {
    archived: false,
    excerpt:
      'Pauta: revisar o escopo do financeiro, decidir a data do piloto e alinhar o suporte.',
    id: 'weekly-sync',
    kind: 'note',
    createdAt: hoursAgo(5),
    ownerId: 'carla',
    pinned: true,
    title: 'Reunião semanal de produto',
  },
  {
    archived: false,
    excerpt:
      'Editor, revisor e leitor: quem cria, quem aprova e quem só acompanha uma publicação.',
    id: 'publishing-stories',
    kind: 'document',
    createdAt: hoursAgo(17),
    ownerId: 'ana',
    pinned: false,
    title: 'Personas e histórias de publicações',
  },
  {
    archived: false,
    excerpt:
      'Contas a pagar, conciliação bancária e o fechamento do mês para o time financeiro.',
    id: 'finance-stories',
    kind: 'document',
    createdAt: hoursAgo(18),
    ownerId: 'diego',
    pinned: false,
    title: 'Personas e histórias do financeiro',
  },
  {
    archived: false,
    excerpt:
      'Ideias soltas: atalhos de teclado no editor, modo foco e exportação em PDF.',
    id: 'editor-ideas',
    kind: 'note',
    createdAt: hoursAgo(20),
    ownerId: 'bruno',
    pinned: false,
    title: 'Ideias para o editor',
  },
  {
    archived: false,
    excerpt:
      'Etapas de um processo jurídico, prazos e responsáveis, comparados entre as duas ferramentas.',
    id: 'process-matrix',
    kind: 'document',
    createdAt: hoursAgo(30),
    ownerId: 'carla',
    pinned: false,
    title: 'Matriz de processos',
  },
  {
    archived: false,
    excerpt:
      'Módulos do núcleo, fronteiras entre pacotes e a ordem de extração para o monorepo.',
    id: 'modular-core',
    kind: 'document',
    createdAt: hoursAgo(52),
    ownerId: 'diego',
    pinned: false,
    title: 'Núcleo modular',
  },
  {
    archived: false,
    excerpt:
      'Comprar café, renovar o domínio, enviar o contrato assinado para a contabilidade.',
    id: 'errands',
    kind: 'note',
    createdAt: hoursAgo(74),
    ownerId: 'ana',
    pinned: false,
    title: 'Pendências da semana',
  },
  {
    archived: false,
    excerpt:
      'Papéis dos agentes, o que cada um decide sozinho e quando pede revisão humana.',
    id: 'agents-organization',
    kind: 'note',
    createdAt: hoursAgo(98),
    ownerId: 'bruno',
    pinned: false,
    title: 'Organização de agentes',
  },
  {
    archived: false,
    excerpt:
      'Referência de menus, popovers e comboboxes sem estilo, usada como base dos componentes.',
    id: 'base-ui-reference',
    kind: 'bookmark',
    createdAt: hoursAgo(26),
    ownerId: 'diego',
    pinned: false,
    title: 'Base UI: documentação de Menu',
  },
  {
    archived: false,
    excerpt:
      'Artigo sobre listas, galerias e quadros como visões da mesma coleção de registros.',
    id: 'collection-views-article',
    kind: 'bookmark',
    createdAt: hoursAgo(60),
    ownerId: 'carla',
    pinned: false,
    title: 'Artigo: visões de uma coleção',
  },
]

const relativeTime = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export const formatCreatedAt = (createdAt: string) => {
  const hours = Math.round(
    (new Date(createdAt).getTime() - NOW.getTime()) / (60 * 60 * 1000),
  )
  const elapsed =
    Math.abs(hours) < 24
      ? relativeTime.format(hours, 'hour')
      : relativeTime.format(Math.round(hours / 24), 'day')
  return `Criado ${elapsed}`
}

export const ownerName = (document: DocumentRecord) =>
  peopleById.get(document.ownerId)?.name ?? 'Sem dono'

export const createDocumentCollection = (
  records: readonly DocumentRecord[],
): CollectionDefinition<DocumentRecord> => ({
  getKey: (document) => document.id,
  getLabel: (document) => document.title,
  groupings: [],
  records: [...records],
})
