import { defaultAuthCommonLabels } from '../shared/labels'
import type { MagicLink6Labels } from './types'

export const defaultMagicLink6Labels: MagicLink6Labels = {
  description: 'Informe seu e-mail e enviaremos um link de acesso.',
  didNotReceive: 'Não recebeu o e-mail?',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  mediaLabel: 'Apresentação do produto',
  noAccount: 'Não tem uma conta?',
  providerContinue: defaultAuthCommonLabels.providerContinue,
  providersGroup: defaultAuthCommonLabels.providersGroup,
  providersSeparator: 'ou continue com',
  resend: 'Reenviar link',
  resendIn: (seconds) => `Reenviar em ${seconds}s`,
  sentDescription: (destination) =>
    destination
      ? `Enviamos um link de acesso para ${destination}.`
      : 'Enviamos um link de acesso para o seu e-mail.',
  sentTitle: 'Verifique seu e-mail',
  signup: 'Criar conta',
  submit: 'Enviar link de acesso',
  title: 'Entrar com link',
  useAnotherEmail: 'Usar outro e-mail',
}
