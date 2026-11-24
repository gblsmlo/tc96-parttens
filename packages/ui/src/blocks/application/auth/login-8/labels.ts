import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login8Labels } from './types'

export const defaultLogin8Labels: Login8Labels = {
  description: 'Informe seu e-mail e enviaremos um link para você entrar.',
  email: defaultAuthCommonLabels.email,
  emailHint: 'Seu link de acesso vale por 15 minutos.',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  providerContinue: defaultAuthCommonLabels.providerContinue,
  providersGroup: defaultAuthCommonLabels.providersGroup,
  providersSeparator: 'ou continue com',
  submit: 'Enviar link de acesso',
  title: 'Entrar na sua conta',
}
