import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login6Values {
  email: string
  password: string
}

export interface Login6Labels extends AuthCommonLabels {
  description: string
  forgotPassword: string
  mediaLabel: string
  noAccount: string
  signup: string
  submit: string
  title: string
}

export interface Login6Props extends AuthBaseProps<Login6Labels> {
  fieldErrors?: AuthFieldErrors<Login6Values>
  forgotPasswordHref?: string
  media?: ReactNode
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login6Values) => void
  providers?: AuthProvider[]
  showProviders?: boolean
  signupHref?: string
}
