import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login9Labels } from './types'

export const defaultLogin9Labels: Login9Labels = {
  asideLabel: 'Depoimento de cliente',
  description: 'Informe seu e-mail e enviaremos um link para você entrar.',
  email: defaultAuthCommonLabels.email,
  emailHint: 'Seu link de acesso vale por 15 minutos.',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  providerContinue: defaultAuthCommonLabels.providerContinue,
  providersGroup: defaultAuthCommonLabels.providersGroup,
  providersSeparator: 'ou continue com',
  rating: (stars) => `Avaliação: ${stars} de 5 estrelas`,
  submit: 'Enviar link de acesso',
  title: 'Entrar na sua conta',
}
