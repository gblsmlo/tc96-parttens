import type { FlowPageLabels } from './types'

export const defaultFlowPageLabels: FlowPageLabels = {
  actions: 'Ações do fluxo',
  add: 'Adicionar passo',
  addStep: 'Adicionar passo',
  askAi: 'Pergunte à IA',
  assistantPlaceholder: 'Pergunte sobre este fluxo…',
  breadcrumb: 'Trilha do fluxo',
  cancel: 'Cancelar',
  canvasGroup: 'Canvas',
  clearDialogDescription:
    'Os estados e as métricas da última execução saem de todos os passos.',
  clearDialogTitle: 'Limpar os resultados?',
  clearResults: 'Limpar resultados',
  copyJson: 'Copiar como JSON',
  delete: 'Excluir passo',
  deleteConfirm: 'Excluir',
  deleteDialogDescription: (name, connections) =>
    `${name} tem ${connections} ${connections === 1 ? 'conexão' : 'conexões'}, que também saem do fluxo.`,
  deleteDialogTitle: (name) => `Excluir ${name}?`,
  detailDescription: 'Descrição',
  detailId: 'Id do passo',
  detailInputs: 'Entradas',
  detailLastRun: 'Última execução',
  detailName: 'Nome',
  detailNext: 'Próximos passos',
  detailOutputs: 'Saídas',
  detailOwner: 'Responsável',
  detailPath: 'Caminho',
  detailType: 'Tipo',
  edit: 'Editar passo',
  formDescription: 'Descrição',
  formName: 'Nome',
  formNameRequired: 'Informe o nome do passo.',
  formOwner: 'Responsável',
  formOwnerNone: 'Sem responsável',
  formPath: 'Caminho',
  formType: 'Tipo',
  lock: 'Travar canvas',
  newStep: 'Novo passo',
  next: 'Próximo passo →',
  notAdded: 'Ainda não adicionado',
  organizeTree: 'Organizar árvore',
  redo: 'Refazer',
  restoreExample: 'Restaurar exemplo',
  run: 'Executar uma vez',
  runEmptyAction: 'Executar uma vez',
  save: 'Salvar passo',
  snapToGrid: 'Alinhar à grade',
  stepCount: (count) => `${count} ${count === 1 ? 'passo' : 'passos'}`,
  tidy: 'Reorganizar',
  undo: 'Desfazer',
  viewing: 'Visualizando',
}

export const workflowPageLabels: Partial<FlowPageLabels> = {
  actions: 'Ações do workflow',
  assistantPlaceholder: 'Pergunte sobre este workflow',
  run: 'Executar uma vez',
}

export const agentPageLabels: Partial<FlowPageLabels> = {
  actions: 'Ações do agente',
  assistantPlaceholder: 'Pergunte sobre este agente',
  run: 'Executar teste',
  runEmptyAction: 'Executar teste',
}

export function resolveFlowPageLabels(
  kind: Partial<FlowPageLabels>,
  labels?: Partial<FlowPageLabels>,
): FlowPageLabels {
  return { ...defaultFlowPageLabels, ...kind, ...labels }
}
