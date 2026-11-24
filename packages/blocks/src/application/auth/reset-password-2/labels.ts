import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { ResetPassword2Labels } from './types'

export const defaultResetPassword2Labels: ResetPassword2Labels = {
  ...defaultAuthNewPasswordLabels,
  backToLogin: 'Voltar para entrar',
  description: 'Escolha uma nova senha para a sua conta.',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  expiredDescription:
    'Este link de redefinição expirou. Solicite um novo para continuar.',
  expiredTitle: 'Link expirado',
  expiringSoon: 'Falta menos de um minuto para este link expirar.',
  hidePassword: defaultAuthCommonLabels.hidePassword,
  linkExpiresIn: (time) => `Este link expira em ${time}`,
  newPassword: 'Nova senha',
  requestNewLink: 'Solicitar novo link',
  requestNewLinkIn: (time) => `Solicitar novamente em ${time}`,
  showPassword: defaultAuthCommonLabels.showPassword,
  submit: 'Redefinir senha',
  title: 'Redefinir senha',
}
