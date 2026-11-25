import type { RichTextEditor5Task } from './types'

export interface RichTextEditor5PlannerData {
  checklist: readonly string[]
  keywords: Record<RichTextEditor5Task, readonly string[]>
  rewrites: readonly { from: string; to: string }[]
  summary: string
  teammates: readonly string[]
  typos: Readonly<Record<string, string>>
}

export const defaultPlannerData: RichTextEditor5PlannerData = {
  checklist: [
    'Migrar os artigos da central antiga',
    'Validar os fluxos de busca com o suporte',
    'Revisar os textos jurídicos',
    'Comunicar o piloto aos clientes',
  ],
  keywords: {
    checklist: ['checklist', 'lista de verificacao', 'passos', 'tarefas'],
    owners: ['responsavel', 'responsaveis', 'dono', 'quem cuida', 'owner'],
    questions: ['pergunta', 'duvida', 'pendencia', 'em aberto', 'questoes'],
    spelling: [
      'ortografia',
      'corrig',
      'typo',
      'erro de digitacao',
      'gramatica',
    ],
    summary: ['resum', 'sintese', 'sumario', 'tldr'],
    tighten: ['enxug', 'conciso', 'concis', 'encurt', 'reescrev', 'direto'],
  },
  rewrites: [
    { from: 'em virtude do fato de que', to: 'porque' },
    { from: 'no sentido de realizar a migração', to: 'para migrar' },
  ],
  summary:
    'Resumo: a nova central de ajuda entra no ar em três ondas, começa por um piloto com clientes selecionados e depende da migração dos artigos e da validação do suporte.',
  teammates: ['Marina', 'Rafael', 'Camila', 'Diego'],
  typos: {
    implantaçao: 'implantação',
    priorirdade: 'prioridade',
    recebimeto: 'recebimento',
    responsavel: 'responsável',
    validaçao: 'validação',
  },
}

export const stepText = {
  editing: (count: number) =>
    `Escrevendo ${count === 1 ? '1 sugestão' : `${count} sugestões`} no texto`,
  planning: (task: string) => `Entendendo o pedido: ${task}`,
  readingDocument: (lines: number) =>
    `Lendo o documento (${lines === 1 ? '1 trecho' : `${lines} trechos`})`,
  readingPassage: 'Lendo o trecho selecionado',
  reviewing: {
    checklist: 'Montando a lista de tarefas do lançamento',
    owners: 'Procurando tarefas com responsável',
    questions: 'Procurando perguntas e pontos a definir',
    spelling: 'Conferindo cada palavra com os erros conhecidos',
    summary: 'Condensando as ideias principais',
    tighten: 'Procurando trechos que podem ficar mais curtos',
  } satisfies Record<RichTextEditor5Task, string>,
}
