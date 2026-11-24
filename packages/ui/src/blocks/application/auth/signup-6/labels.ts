import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { Signup6Labels } from './types'

export const defaultSignup6Labels: Signup6Labels = {
  ...defaultAuthCommonLabels,
  ...defaultAuthNewPasswordLabels,
  description: 'Preencha os dados para criar a sua conta.',
  hasAccount: 'Já tem uma conta?',
  login: 'Entrar',
  mediaLabel: 'Apresentação do produto',
  name: 'Nome',
  privacy: 'Política de Privacidade',
  providersSeparator: 'ou continue com',
  submit: 'Criar conta',
  terms: 'Termos de Uso',
  termsAnd: 'e a',
  termsLead: 'Ao criar a conta você concorda com os',
  title: 'Criar conta',
}
