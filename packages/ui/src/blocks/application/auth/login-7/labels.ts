import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login7Labels } from './types'

export const defaultLogin7Labels: Login7Labels = {
  ...defaultAuthCommonLabels,
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  footerLinksLabel: 'Links do rodapé',
  forgotPassword: 'Esqueceu a senha?',
  noAccount: 'Não tem uma conta?',
  providersSeparator: 'ou continue com',
  signup: 'Criar conta',
  submit: 'Entrar',
  title: 'Entrar',
}
