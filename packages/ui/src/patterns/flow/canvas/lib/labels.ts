import type { FlowCanvasLabels, FlowShortcutsLabels } from '../types'

export const defaultFlowCanvasLabels: FlowCanvasLabels = {
  actions: {
    'add-after': (name) => `Adicionar um passo depois de ${name}`,
    'add-branch': (name) => `Adicionar ramo em ${name}`,
    delete: (name) => `Excluir ${name}`,
    duplicate: (name) => `Duplicar ${name}`,
    edit: (name) => `Editar ${name}`,
    view: (name) => `Ver ${name}`,
  },
  addAfterLeaf: (name) => `Adicionar um passo depois de ${name}`,
  canvas: 'Canvas do fluxo',
  controls: 'Controles do canvas',
  edgeAdd: (label) =>
    label
      ? `Adicionar um passo no caminho ${label}`
      : 'Adicionar um passo aqui',
  edgeRemove: (label) =>
    label ? `Remover a conexão do caminho ${label}` : 'Remover esta conexão',
  emptyDescription:
    'Arraste um passo da biblioteca ou clique em Adicionar passo.',
  emptyTitle: 'Nenhum passo ainda',
  menuActions: {
    'add-after': 'Adicionar passo depois',
    'add-branch': 'Adicionar ramo',
    delete: 'Excluir',
    duplicate: 'Duplicar',
    edit: 'Editar',
    view: 'Ver',
  },
  minimap: 'Minimapa',
  mode: 'Modo do cursor',
  pan: 'Mover',
  select: 'Selecionar',
  sourceHandle: (name) => `Conectar a partir de ${name}`,
  statuses: {
    failed: 'Falhou',
    idle: 'Parado',
    'not-run': 'Não executado',
    running: 'Executando',
    skipped: 'Ignorado',
    success: 'Sucesso',
  },
  stepMenu: (name) => `Ações de ${name}`,
  stepName: (name, type, status) => `${name}, ${type}, ${status}`,
  stepRoleDescription: 'passo',
  stepToolbar: (name) => `Ações de ${name}`,
  targetHandle: (name) => `Conectar em ${name}`,
  zoomIn: 'Aumentar zoom',
  zoomLevel: (percent) => `Nível de zoom ${percent}%`,
  zoomOut: 'Diminuir zoom',
}

export const defaultFlowShortcutsLabels: FlowShortcutsLabels = {
  actualSize: 'Tamanho real',
  fit: 'Ajustar à tela',
  pan: 'Mover',
  remove: 'Excluir passo',
  select: 'Selecionar',
  title: 'Atalhos de teclado',
  trigger: 'Atalhos de teclado',
  zoomIn: 'Aumentar zoom',
  zoomOut: 'Diminuir zoom',
}

export function resolveFlowCanvasLabels(
  labels: Partial<FlowCanvasLabels> | undefined,
): FlowCanvasLabels {
  return { ...defaultFlowCanvasLabels, ...labels }
}
