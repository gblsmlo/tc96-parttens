import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login3Labels } from './types'

export const defaultLogin3Labels: Login3Labels = {
  ...defaultAuthCommonLabels,
  asideLabel: 'Informações sobre o produto',
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  forgotPassword: 'Esqueceu a senha?',
  noAccount: 'Não tem uma conta?',
  remember: 'Lembrar de mim',
  signup: 'Criar conta',
  submit: 'Entrar',
  title: 'Entrar',
}
