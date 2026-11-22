import type { WizardStep } from '@tc96/parttens'

export const behaviorSteps: WizardStep[] = [
  {
    description: 'Escolha o tipo',
    icon: <svg aria-hidden="true" data-testid="type-icon" />,
    title: 'Tipo',
    value: 'type',
  },
  { description: 'Informe os dados', title: 'Detalhes', value: 'details' },
  { disabled: true, title: 'Revisão', value: 'review' },
]
