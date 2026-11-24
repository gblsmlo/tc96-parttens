import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Signup3Values {
  email: string
  password: string
}

export interface Signup3Labels extends AuthCommonLabels {
  brandsGroup: string
  description: string
  hasAccount: string
  heading: ReactNode
  login: string
  passwordPlaceholder: string
  pitch: string
  privacy: string
  submit: string
  terms: string
  termsAnd: string
  termsLead: string
  title: string
}

export interface Signup3Props extends AuthBaseProps<Signup3Labels> {
  badge?: string
  brands?: ReactNode
  brandsLabel?: string
  fieldErrors?: AuthFieldErrors<Signup3Values>
  loginHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Signup3Values) => void
  passwordMinLength?: number
  privacyHref?: string
  providers?: AuthProvider[]
  termsHref?: string
}
