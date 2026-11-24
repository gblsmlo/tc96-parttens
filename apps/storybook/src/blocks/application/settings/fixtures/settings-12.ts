import type { Settings12Stage } from '@tc96/ui/blocks/application/settings/settings-12'

export interface Settings12Data {
  blockStageChanges: boolean
  stages: Settings12Stage[]
}

export const settings12Data: Settings12Data = {
  blockStageChanges: false,
  stages: [
    {
      actions: [
        {
          id: 'action-primeiro-contato',
          required: true,
          title: 'Primeiro contato',
          type: 'call',
        },
        {
          id: 'action-enviar-apresentacao',
          required: false,
          title: 'Enviar apresentação',
          type: 'email',
        },
      ],
      id: 'stage-novo-lead',
      name: 'Novo lead',
    },
    {
      actions: [
        {
          id: 'action-reuniao-diagnostico',
          required: true,
          title: 'Reunião de diagnóstico',
          type: 'meeting',
        },
        {
          id: 'action-retorno-financeiro',
          required: false,
          title: 'Retorno do financeiro',
          type: 'follow-up',
        },
      ],
      id: 'stage-qualificacao',
      name: 'Qualificação',
    },
    {
      actions: [],
      id: 'stage-proposta',
      name: 'Proposta',
    },
  ],
}
