import { defaultAuthCommonLabels } from '../shared/labels'
import type { Signup3Labels } from './types'

export const defaultSignup3Labels: Signup3Labels = {
  ...defaultAuthCommonLabels,
  brandsGroup: 'Empresas que usam o produto',
  description: 'Sem cartão de crédito. Cancele quando quiser.',
  email: 'E-mail de trabalho',
  hasAccount: 'Já tem uma conta?',
  heading: 'Tudo o que seu time precisa para vender mais',
  login: 'Entrar',
  passwordPlaceholder: 'Mínimo de 8 caracteres',
  pitch:
    'Centralize clientes, negócios e conversas e acompanhe cada etapa do funil.',
  privacy: 'Política de Privacidade',
  providersGroup: 'Criar conta com outro serviço',
  providersSeparator: 'OU',
  submit: 'Começar teste grátis',
  terms: 'Termos de Uso',
  termsAnd: 'e a',
  termsLead: 'Ao criar a conta você concorda com os',
  title: 'Comece seu teste de 14 dias',
}
