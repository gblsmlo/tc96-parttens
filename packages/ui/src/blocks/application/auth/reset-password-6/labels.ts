import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { ResetPassword6Labels } from './types'

export const defaultResetPassword6Labels: ResetPassword6Labels = {
  ...defaultAuthNewPasswordLabels,
  backToLogin: 'Voltar para entrar',
  description: 'Escolha uma nova senha para a sua conta.',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  hidePassword: defaultAuthCommonLabels.hidePassword,
  mediaLabel: 'Apresentação do produto',
  newPassword: 'Nova senha',
  showPassword: defaultAuthCommonLabels.showPassword,
  submit: 'Redefinir senha',
  title: 'Redefinir senha',
}
