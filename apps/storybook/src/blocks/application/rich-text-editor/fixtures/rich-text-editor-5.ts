import type {
  RichTextEditor5PlanEvent,
  RichTextEditor5Planner,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'

export const rolloutAuthor = { id: 'ana', name: 'Ana Souza' }

export const rolloutAuthors = [
  rolloutAuthor,
  { id: 'julia', name: 'Júlia Prado' },
]

export const rolloutDocumentName = 'Plano de lançamento'

export const rolloutTime = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)

const paragraph = (text: string) => ({ children: [{ text }], type: 'p' })

const item = (text: string) => ({
  children: [{ children: [{ text }], type: 'lic' }],
  type: 'li',
})

export const rolloutTypoCount = 5
export const rolloutRewriteCount = 2
export const rolloutQuestionCount = 2
export const rolloutTbdCount = 1
export const rolloutOwnerCount = 3

export function rolloutValue(): RichTextValue {
  return [
    {
      children: [{ text: 'Plano de lançamento da central de ajuda' }],
      type: 'h2',
    },
    paragraph(
      'Este plano descreve o recebimeto dos artigos migrados e a implantaçao em três ondas, em virtude do fato de que o suporte precisa da validaçao completa antes do piloto.',
    ),
    { children: [{ text: 'Cronograma' }], type: 'h3' },
    paragraph(
      'A segunda onda existe no sentido de realizar a migração dos artigos mais acessados, com priorirdade para os de cobrança.',
    ),
    { children: [{ text: 'Responsáveis' }], type: 'h3' },
    {
      children: [
        item('Marina fica com a migração dos artigos.'),
        item('Rafael valida os fluxos de busca com o suporte.'),
      ],
      type: 'ul',
    },
    { children: [{ text: 'Pendências' }], type: 'h3' },
    paragraph('A data do piloto ainda é TBD.'),
    paragraph('Quem aprova o texto final dos artigos jurídicos?'),
    paragraph('O piloto inclui clientes do plano gratuito?'),
    paragraph('O responsavel pelo treinamento do suporte é Camila.'),
  ] as RichTextValue
}

export const modelPlanner: RichTextEditor5Planner = async function* ({
  signal,
  task,
}): AsyncGenerator<RichTextEditor5PlanEvent> {
  yield {
    step: { id: 'model-1', kind: 'planning', text: `Modelo externo: ${task}` },
    type: 'step',
  }
  if (signal.aborted) return
  yield {
    step: { id: 'model-2', kind: 'editing', text: 'Escrevendo a sugestão' },
    type: 'step',
  }
  yield {
    edit: {
      find: 'Cronograma',
      text: 'Cronograma em três ondas',
      type: 'replace',
    },
    type: 'edit',
  }
}

export const rolloutBreadcrumbs = [
  { href: '/documentos', label: 'Documentos' },
  { href: '/documentos/suporte', label: 'Suporte' },
  { label: 'Plano de lançamento' },
]
