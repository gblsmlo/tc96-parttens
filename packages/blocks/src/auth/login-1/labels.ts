import { defaultAuthCommonLabels } from '../shared/labels'
import type { LoginLabels } from './types'

export const defaultLoginLabels: LoginLabels = {
  ...defaultAuthCommonLabels,
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  forgotPassword: 'Esqueceu a senha?',
  noAccount: 'Não tem uma conta?',
  remember: 'Lembrar de mim',
  signup: 'Criar conta',
  submit: 'Entrar',
  title: 'Entrar',
}
