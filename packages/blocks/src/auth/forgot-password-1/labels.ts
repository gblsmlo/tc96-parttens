import { defaultAuthCommonLabels } from '../shared/labels'
import type { ForgotPasswordLabels } from './types'

export const defaultForgotPasswordLabels: ForgotPasswordLabels = {
  backToLogin: 'Voltar para entrar',
  description:
    'Informe seu e-mail e enviaremos um link para redefinir a senha.',
  didNotReceive: 'Não recebeu o e-mail?',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  resend: 'Reenviar e-mail',
  resendIn: (seconds) => `Reenviar em ${seconds}s`,
  sentDescription: (destination) =>
    destination
      ? `Enviamos um link para redefinir a senha para ${destination}.`
      : 'Enviamos um link para redefinir a senha para o seu e-mail.',
  sentTitle: 'Verifique seu e-mail',
  submit: 'Enviar link',
  title: 'Esqueceu a senha?',
}
