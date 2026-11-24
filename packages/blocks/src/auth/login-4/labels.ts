import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login4Labels } from './types'

export const defaultLogin4Labels: Login4Labels = {
  description: 'Informe seu e-mail e enviaremos um link para você entrar.',
  didNotReceive: 'Não recebeu o e-mail?',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  passwordLogin: 'Entrar com senha',
  resend: 'Reenviar link',
  resendIn: (seconds) => `Reenviar em ${seconds}s`,
  sentDescription: (destination) =>
    destination
      ? `Enviamos um link para entrar para ${destination}.`
      : 'Enviamos um link para entrar para o seu e-mail.',
  sentTitle: 'Verifique seu e-mail',
  submit: 'Enviar link',
  title: 'Entrar com link',
}
