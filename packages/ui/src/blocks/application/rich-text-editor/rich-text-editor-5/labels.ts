import type { RichTextEditor5Labels } from './types'

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`

export const defaultRichTextEditor5Labels: RichTextEditor5Labels = {
  acceptAll: 'Aceitar tudo',
  assistant: 'Assistente',
  bubble: 'Ações para o trecho selecionado',
  bubbleAsk: 'Pedir ao assistente',
  bubbleSpelling: 'Corrigir ortografia',
  bubbleSummary: 'Resumir',
  clearPassage: 'Remover trecho selecionado',
  collapse: 'Recolher assistente',
  conversation: 'Conversa com o assistente',
  dock: 'Assistente de escrita',
  document: 'Plano de lançamento',
  done: (edits, findings) =>
    findings > 0
      ? `Pronto: ${plural(findings, 'achado', 'achados')}, nenhuma alteração no texto.`
      : edits > 0
        ? `Pronto: ${plural(edits, 'sugestão escrita', 'sugestões escritas')} no texto.`
        : 'Pronto: não havia nada para sugerir.',
  emptyDescription:
    'Escolha uma tarefa ou digite / no campo abaixo. As alterações entram no texto como sugestões para você aceitar ou rejeitar.',
  emptyTitle: 'Como posso ajudar no plano?',
  failed: 'A tarefa falhou. Nada foi alterado além das sugestões já escritas.',
  fallback: (request) =>
    `Não entendi “${request}”. Experimente uma destas tarefas:`,
  findingKinds: {
    owner: 'Responsável',
    question: 'Pergunta',
    tbd: 'A definir',
  },
  findings: 'Achados',
  findingsEmpty: 'Nada encontrado no texto.',
  goTo: 'Ir para o trecho',
  goToFinding: (finding) => `Ir para o trecho: ${finding.text}`,
  jump: 'Ir para a mais recente',
  next: 'Próxima sugestão',
  passage: (text) => `Trecho: ${text}`,
  pending: (count) =>
    plural(count, 'sugestão para revisar', 'sugestões para revisar'),
  position: (current, total) => `${current} de ${total}`,
  previous: 'Sugestão anterior',
  rejectAll: 'Rejeitar tudo',
  request: 'Peça algo ao assistente',
  requestPlaceholder: 'Peça algo, por exemplo “enxugue o texto”',
  review: {
    accept: 'Aceitar',
    acceptChange: (change) =>
      `Aceitar sugestão de ${change.author.name}: ${change.after || change.before}`,
    empty: 'Nenhuma sugestão para revisar.',
    kind: { delete: 'Exclusão', insert: 'Inserção', replace: 'Substituição' },
    list: 'Sugestões do assistente',
    now: 'Depois',
    reject: 'Rejeitar',
    rejectChange: (change) =>
      `Rejeitar sugestão de ${change.author.name}: ${change.after || change.before}`,
    was: 'Antes',
  },
  reviewTitle: 'Revisão das sugestões',
  running: (task) => `Trabalhando: ${task}`,
  send: 'Enviar pedido',
  steps: 'Etapas da tarefa',
  stop: 'Parar',
  stopped: (edits) =>
    `Interrompido: ${plural(edits, 'sugestão mantida', 'sugestões mantidas')} no texto.`,
  tasks: {
    checklist: 'Adicionar checklist',
    owners: 'Listar responsáveis',
    questions: 'Listar perguntas em aberto',
    spelling: 'Corrigir ortografia',
    summary: 'Escrever resumo',
    tighten: 'Enxugar o texto',
  },
  taskMenu: 'Escolher uma tarefa',
  tasksGroup: 'Tarefas do assistente',
  typing: 'O assistente está trabalhando',
  undo: 'Desfazer última decisão',
}
