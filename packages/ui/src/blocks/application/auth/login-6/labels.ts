import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login6Labels } from './types'

export const defaultLogin6Labels: Login6Labels = {
  ...defaultAuthCommonLabels,
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  forgotPassword: 'Esqueceu a senha?',
  mediaLabel: 'Apresentação do produto',
  noAccount: 'Não tem uma conta?',
  providersSeparator: 'ou continue com',
  signup: 'Criar conta',
  submit: 'Entrar',
  title: 'Entrar',
}
