import { defaultAuthCommonLabels } from '../shared/labels'
import type { Login10Labels } from './types'

export const defaultLogin10Labels: Login10Labels = {
  ...defaultAuthCommonLabels,
  asideDescription:
    'Organize clientes, tarefas e conversas do time em um só lugar.',
  asideHeading: 'Todo o seu trabalho, em um só lugar',
  asideLabel: 'Sobre o produto',
  description: 'Informe seu e-mail e sua senha para acessar a conta.',
  footerLinks: 'Links do rodapé',
  forgotPassword: 'Esqueceu a senha?',
  noAccount: 'Não tem uma conta?',
  providersSeparator: 'ou continue com',
  showTestimonial: (name) => `Mostrar depoimento de ${name}`,
  signup: 'Criar conta',
  submit: 'Entrar',
  testimonials: 'Depoimentos de clientes',
  title: 'Bem-vindo de volta',
}
