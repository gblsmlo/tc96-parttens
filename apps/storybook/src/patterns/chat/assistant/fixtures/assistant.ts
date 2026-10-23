import type { AssistantMessage, AssistantSuggestion } from '@tc96/parttens'

export const suggestions: AssistantSuggestion[] = [
  { id: 'why-failed', label: 'Por que o passo Enriquecer empresa falhou?' },
  { id: 'skipped', label: 'Quais passos foram pulados?' },
  { id: 'summary', label: 'Rascunhe um resumo da execução' },
]

export const messages: AssistantMessage[] = [
  {
    at: '2026-10-23T14:02:00',
    id: 'm1',
    role: 'user',
    text: 'Por que o passo Enriquecer empresa falhou?',
    time: '14:02',
  },
  {
    at: '2026-10-23T14:02:08',
    id: 'm2',
    role: 'assistant',
    text: 'A chamada ao provedor de dados excedeu o tempo limite de 30 s. O passo tentou duas vezes e foi marcado como falho; os passos seguintes foram pulados.',
    time: '14:02',
  },
  {
    at: '2026-10-23T14:03:00',
    id: 'm3',
    role: 'user',
    text: 'Dá para aumentar o limite?',
    time: '14:03',
  },
  {
    at: '2026-10-23T14:03:10',
    id: 'm4',
    role: 'assistant',
    text: 'Sim. Abra o passo, vá em Build e aumente o tempo limite. Considere também ligar a nova tentativa com espera entre as chamadas.',
    time: '14:03',
  },
]

export const failedMessages: AssistantMessage[] = [
  messages[0] as AssistantMessage,
  {
    error: true,
    id: 'm-error',
    role: 'assistant',
    text: 'Não consegui responder agora.',
  },
]
