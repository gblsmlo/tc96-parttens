import type { OnboardingBaseLabels } from './types'

export const defaultOnboardingLabels: OnboardingBaseLabels = {
  back: 'Voltar',
  errorTitle: 'Não foi possível continuar',
  finish: 'Concluir',
  next: 'Continuar',
  skip: 'Pular',
  start: 'Começar',
  stepOf: (current, total) => `Passo ${current} de ${total}`,
  successDescription:
    'Sua conta está configurada. Você já pode começar a usar.',
  successTitle: 'Tudo pronto',
}
