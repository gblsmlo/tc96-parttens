import type { FlowStepType } from '@tc96/parttens'

export const agentStepTypes: FlowStepType[] = [
  {
    description: 'Modelo de linguagem que responde',
    group: 'Modelos',
    id: 'model-chat',
    kind: 'trigger',
    label: 'Modelo de conversa',
  },
  {
    description: 'Consulta uma coleção de documentos',
    group: 'Dados',
    id: 'collection-search',
    kind: 'action',
    label: 'Buscar na coleção',
  },
  {
    description: 'Envia a resposta ao contato',
    group: 'Mensagens',
    id: 'reply-message',
    kind: 'action',
    label: 'Responder mensagem',
  },
  {
    description: 'Chama uma ferramenta externa',
    group: 'Ferramentas',
    id: 'tool-call',
    kind: 'action',
    label: 'Chamar ferramenta',
  },
]
