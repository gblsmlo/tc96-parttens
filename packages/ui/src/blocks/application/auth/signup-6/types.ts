import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
  AuthProvider,
} from '../shared/types'

export interface Signup6Values {
  name: string
  email: string
  password: string
}

export interface Signup6Labels extends AuthCommonLabels, AuthNewPasswordLabels {
  description: string
  hasAccount: string
  login: string
  mediaLabel: string
  name: string
  privacy: string
  submit: string
  terms: string
  termsAnd: string
  termsLead: string
  title: string
}

export interface Signup6Props extends AuthBaseProps<Signup6Labels> {
  fieldErrors?: AuthFieldErrors<Signup6Values>
  loginHref?: string
  media?: ReactNode
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Signup6Values) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
  privacyHref?: string
  providers?: AuthProvider[]
  showProviders?: boolean
  termsHref?: string
}
