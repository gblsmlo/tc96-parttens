import {
  defaultAuthCommonLabels,
  defaultAuthNewPasswordLabels,
} from '../shared/labels'
import type { SignupLabels } from './types'

export const defaultSignupLabels: SignupLabels = {
  ...defaultAuthCommonLabels,
  ...defaultAuthNewPasswordLabels,
  description: 'Preencha os dados para começar.',
  hasAccount: 'Já tem uma conta?',
  login: 'Entrar',
  name: 'Nome',
  privacy: 'Política de Privacidade',
  providersSeparator: 'ou registre com e-mail e senha',
  submit: 'Criar conta',
  terms: 'Termos de Uso',
  termsAnd: 'e a',
  termsLead: 'Ao criar a conta você concorda com os',
  title: 'Criar conta',
}
