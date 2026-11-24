import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login3Values {
  email: string
  password: string
  remember: boolean
}

export interface Login3Labels extends AuthCommonLabels {
  asideLabel: string
  description: string
  forgotPassword: string
  noAccount: string
  remember: string
  signup: string
  submit: string
  title: string
}

export interface Login3Props extends AuthBaseProps<Login3Labels> {
  aside?: ReactNode
  fieldErrors?: AuthFieldErrors<Login3Values>
  forgotPasswordHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login3Values) => void
  providers?: AuthProvider[]
  signupHref?: string
}
