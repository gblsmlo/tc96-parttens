export type AssistantPlacement = 'floating' | 'docked'

export type AssistantMessageRole = 'user' | 'assistant'

export interface AssistantMessage {
  at?: string
  error?: boolean
  id: string
  role: AssistantMessageRole
  text: string
  time?: string
}

export interface AssistantSuggestion {
  id: string
  label: string
}

export interface AssistantLabels {
  attach: string
  beta: string
  composer: string
  conversation: string
  end: string
  expand: string
  history: string
  jump: string
  minimize: string
  newChat: string
  retry: string
  send: string
  suggestions: string
  title: string
  typing: string
}

export const assistantDefaultLabels: AssistantLabels = {
  attach: 'Anexar contexto',
  beta: 'Beta',
  composer: 'Mensagem para o assistente',
  conversation: 'Mensagens do assistente',
  end: 'Encerrar',
  expand: 'Expandir',
  history: 'Histórico',
  jump: 'Ir para a mais recente',
  minimize: 'Minimizar',
  newChat: 'Nova conversa',
  retry: 'Tentar de novo',
  send: 'Enviar',
  suggestions: 'Experimente perguntar',
  title: 'Assistente',
  typing: 'O assistente está digitando',
}

export const assistantDefaultDisclaimer =
  'As respostas podem estar erradas. Confira antes de publicar.'

export const assistantDefaultPlaceholder = 'Pergunte sobre este fluxo…'

export function mergeAssistantLabels(
  labels?: Partial<AssistantLabels>,
): AssistantLabels {
  return { ...assistantDefaultLabels, ...labels }
}

export function assistantDraftText(text: string): string | null {
  const trimmed = text.trim()
  return trimmed === '' ? null : trimmed
}

export function assistantItemCount(
  messages: readonly AssistantMessage[],
  typing: boolean,
): number {
  return messages.length + (typing ? 1 : 0)
}
