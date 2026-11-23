import { defaultAuthCommonLabels } from '../shared/labels'
import type { OtpLabels } from './types'

export const defaultOtpLabels: OtpLabels = {
  code: 'Código de verificação',
  description: (length, destination) =>
    destination
      ? `Enviamos um código de ${length} dígitos para ${destination}.`
      : `Enviamos um código de ${length} dígitos.`,
  didNotReceive: 'Não recebeu o código?',
  digit: (position, total) => `Dígito ${position} de ${total}`,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  resend: 'Reenviar código',
  resendIn: (seconds) => `Reenviar em ${seconds}s`,
  submit: 'Verificar',
  submitPending: 'Verificando…',
  title: 'Verifique seu código',
}
