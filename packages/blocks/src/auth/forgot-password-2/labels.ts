import { defaultAuthCommonLabels } from '../shared/labels'
import type { ForgotPassword2Labels } from './types'

export const defaultForgotPassword2Labels: ForgotPassword2Labels = {
  description:
    'Informe seu e-mail e enviaremos um link para redefinir a senha.',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  sentDescription: (destination) =>
    destination
      ? `Enviamos um link para redefinir a senha para ${destination}.`
      : 'Enviamos um link para redefinir a senha para o seu e-mail.',
  sentTitle: 'Verifique seu e-mail',
  submit: 'Enviar link',
  title: 'Esqueceu a senha?',
}
