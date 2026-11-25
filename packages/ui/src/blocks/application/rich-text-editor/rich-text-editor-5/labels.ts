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
  collapse: 'Recolher painel do assistente',
  dock: 'Assistente de escrita',
  document: 'Plano de lançamento',
  done: (edits, findings) =>
    findings > 0
      ? `Pronto: ${plural(findings, 'achado', 'achados')}, nenhuma alteração no texto.`
      : edits > 0
        ? `Pronto: ${plural(edits, 'sugestão escrita', 'sugestões escritas')} no texto.`
        : 'Pronto: não havia nada para sugerir.',
  expand: 'Expandir painel do assistente',
  failed: 'A tarefa falhou. Nada foi alterado além das sugestões já escritas.',
  formatting: 'Formatação do plano',
  history: { redo: 'Refazer', undo: 'Desfazer' },
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
  marks: { bold: 'Negrito', italic: 'Itálico' },
  next: 'Próxima sugestão',
  passage: (text) => `Trecho: ${text}`,
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
  tasksGroup: 'Tarefas do assistente',
  undo: 'Desfazer última decisão',
}
