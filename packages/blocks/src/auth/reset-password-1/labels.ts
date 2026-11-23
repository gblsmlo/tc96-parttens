import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { ResetPasswordLabels } from './types'

export const defaultResetPasswordLabels: ResetPasswordLabels = {
  ...defaultAuthNewPasswordLabels,
  backToLogin: 'Voltar para entrar',
  description: 'Escolha uma nova senha para a sua conta.',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  hidePassword: defaultAuthCommonLabels.hidePassword,
  newPassword: 'Nova senha',
  showPassword: defaultAuthCommonLabels.showPassword,
  submit: 'Redefinir senha',
  title: 'Redefinir senha',
}
