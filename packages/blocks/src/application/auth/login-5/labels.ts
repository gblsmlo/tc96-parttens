import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login5Labels } from './types'

export const defaultLogin5Labels: Login5Labels = {
  backToMethods: 'Outras formas de entrar',
  description: 'Escolha como você quer acessar a conta.',
  email: defaultAuthCommonLabels.email,
  emailDescription: 'Informe seu e-mail e sua senha para acessar a conta.',
  emailMethod: 'E-mail e senha',
  emailTitle: 'Entrar com e-mail',
  errorTitle: defaultAuthCommonLabels.errorTitle,
  forgotPassword: 'Esqueceu a senha?',
  hidePassword: defaultAuthCommonLabels.hidePassword,
  methodsGroup: 'Formas de entrar',
  noAccount: 'Não tem uma conta?',
  password: defaultAuthCommonLabels.password,
  showPassword: defaultAuthCommonLabels.showPassword,
  signup: 'Criar conta',
  submit: 'Entrar',
  title: 'Entrar',
}
