import type { FlowStepType } from '@tc96/parttens'

export const workflowStepTypes: FlowStepType[] = [
  {
    description: 'Envia um e-mail ao contato',
    group: 'Mensagens',
    id: 'send-email',
    kind: 'action',
    label: 'Enviar e-mail',
  },
  {
    description: 'Envia uma mensagem de WhatsApp',
    group: 'Mensagens',
    id: 'send-whatsapp',
    kind: 'action',
    label: 'Enviar WhatsApp',
  },
  {
    description: 'Lê um registro do cadastro',
    group: 'Dados',
    id: 'read-record',
    kind: 'trigger',
    label: 'Ler registro',
  },
  {
    description: 'Grava os campos no cadastro',
    group: 'Dados',
    id: 'update-record',
    kind: 'action',
    label: 'Atualizar registro',
  },
  {
    description: 'Espera um tempo antes do próximo passo',
    group: 'Esperas',
    id: 'wait-duration',
    kind: 'action',
    label: 'Esperar por tempo',
  },
  {
    description: 'Espera até um dia e hora',
    group: 'Esperas',
    id: 'wait-until',
    kind: 'action',
    label: 'Esperar até data',
  },
  {
    description: 'Desvia o fluxo conforme uma condição',
    group: 'Controle de fluxo',
    id: 'condition',
    kind: 'condition',
    label: 'Condição',
  },
]
