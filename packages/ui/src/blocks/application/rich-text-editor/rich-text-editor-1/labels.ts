import type { RichTextEditor1Labels } from './types'

export const defaultRichTextEditor1Labels: RichTextEditor1Labels = {
  align: {
    center: 'Centralizar',
    justify: 'Justificar',
    left: 'Alinhar à esquerda',
    right: 'Alinhar à direita',
  },
  blockType: 'Tipo de bloco',
  blocks: {
    h1: 'Título 1',
    h2: 'Título 2',
    h3: 'Título 3',
    paragraph: 'Texto',
  },
  bulletList: 'Lista com marcadores',
  characters: (count) => `${count} ${count === 1 ? 'caractere' : 'caracteres'}`,
  clear: {
    cancel: 'Cancelar',
    confirm: 'Limpar documento',
    description:
      'Todo o conteúdo será removido. Você poderá restaurá-lo logo depois.',
    done: 'Documento limpo',
    restore: 'Restaurar documento',
    title: 'Limpar o documento?',
  },
  codeBlock: 'Bloco de código',
  copy: {
    html: 'Copiar como HTML',
    htmlDone: 'Documento copiado como HTML',
    text: 'Copiar como texto',
    textDone: 'Documento copiado como texto',
  },
  divider: 'Divisor',
  document: 'Conteúdo do documento',
  editMode: 'Editar',
  emptyTitle: 'Documento sem título',
  history: { redo: 'Refazer', undo: 'Desfazer' },
  link: {
    apply: 'Aplicar',
    button: 'Link',
    remove: 'Remover',
    url: 'Endereço do link',
  },
  marks: {
    bold: 'Negrito',
    code: 'Código',
    highlight: 'Destaque',
    italic: 'Itálico',
    strikethrough: 'Tachado',
    underline: 'Sublinhado',
  },
  numberedList: 'Lista numerada',
  placeholder: 'Comece a escrever o documento',
  quote: 'Citação',
  readingTime: (minutes) => `${minutes} min de leitura`,
  saveState: { saved: 'Salvo', unsaved: 'Alterações não salvas' },
  shortcuts: {
    markdownRules: [
      { id: 'h1', label: 'Título 1', syntax: '#' },
      { id: 'h2', label: 'Título 2', syntax: '##' },
      { id: 'h3', label: 'Título 3', syntax: '###' },
      { id: 'quote', label: 'Citação', syntax: '>' },
      { id: 'bullet', label: 'Lista com marcadores', syntax: '-' },
      { id: 'numbered', label: 'Lista numerada', syntax: '1.' },
    ],
    markdownTitle: 'Markdown no início da linha, seguido de Espaço',
    shortcutList: [
      { id: 'bold', keys: ['Ctrl', 'B'], label: 'Negrito' },
      { id: 'italic', keys: ['Ctrl', 'I'], label: 'Itálico' },
      { id: 'underline', keys: ['Ctrl', 'U'], label: 'Sublinhado' },
      { id: 'strike', keys: ['Ctrl', 'Shift', 'X'], label: 'Tachado' },
      { id: 'code', keys: ['Ctrl', 'E'], label: 'Código' },
      { id: 'highlight', keys: ['Ctrl', 'Shift', 'H'], label: 'Destaque' },
      { id: 'undo', keys: ['Ctrl', 'Z'], label: 'Desfazer' },
      { id: 'redo', keys: ['Ctrl', 'Shift', 'Z'], label: 'Refazer' },
    ],
    shortcutsTitle: 'Teclado',
    title: 'Atalhos de escrita',
    trigger: 'Atalhos',
  },
  taskList: 'Lista de tarefas',
  titleLabel: 'Título do documento',
  toolbar: 'Formatação do documento',
  viewMode: 'Somente leitura',
  words: (count) => `${count} ${count === 1 ? 'palavra' : 'palavras'}`,
}

export function resolveRichTextEditor1Labels(
  labels: Partial<RichTextEditor1Labels> = {},
): RichTextEditor1Labels {
  const defaults = defaultRichTextEditor1Labels
  return {
    ...defaults,
    ...labels,
    align: { ...defaults.align, ...labels.align },
    blocks: { ...defaults.blocks, ...labels.blocks },
    clear: { ...defaults.clear, ...labels.clear },
    copy: { ...defaults.copy, ...labels.copy },
    history: { ...defaults.history, ...labels.history },
    link: { ...defaults.link, ...labels.link },
    marks: { ...defaults.marks, ...labels.marks },
    saveState: { ...defaults.saveState, ...labels.saveState },
    shortcuts: { ...defaults.shortcuts, ...labels.shortcuts },
  }
}
