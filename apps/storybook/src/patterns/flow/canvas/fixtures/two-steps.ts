import type { FlowConnection, FlowStep, FlowStepType } from '@tc96/parttens'

export const twoSteps: FlowStep[] = [
  {
    id: 'form',
    kind: 'trigger',
    name: 'Novo lead',
    position: { x: 0, y: 0 },
    type: 'form',
  },
  {
    id: 'mail',
    name: 'Enviar e-mail',
    position: { x: 300, y: 0 },
    type: 'mail',
  },
]

export const twoStepsConnections: FlowConnection[] = [
  { id: 'form-mail', source: 'form', target: 'mail' },
]

export const twoStepsTypes: FlowStepType[] = [
  { group: 'g', id: 'form', kind: 'trigger', label: 'Formulário' },
  { group: 'g', id: 'mail', label: 'E-mail' },
]
