import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login2Labels } from './types'

export const defaultLogin2Labels: Login2Labels = {
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  hidePassword: defaultAuthCommonLabels.hidePassword,
  password: defaultAuthCommonLabels.password,
  showPassword: defaultAuthCommonLabels.showPassword,
  submit: 'Entrar',
  title: 'Entrar',
}
