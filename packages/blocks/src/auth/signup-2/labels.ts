import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { Signup2Labels } from './types'

export const defaultSignup2Labels: Signup2Labels = {
  ...defaultAuthNewPasswordLabels,
  description: 'Preencha os dados para começar.',
  email: defaultAuthCommonLabels.email,
  errorTitle: defaultAuthCommonLabels.errorTitle,
  hidePassword: defaultAuthCommonLabels.hidePassword,
  name: 'Nome',
  password: defaultAuthCommonLabels.password,
  showPassword: defaultAuthCommonLabels.showPassword,
  submit: 'Criar conta',
  title: 'Criar conta',
}
