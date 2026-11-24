import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login7Values {
  email: string
  password: string
}

export interface Login7FooterLink {
  href: string
  label: string
}

export interface Login7Labels extends AuthCommonLabels {
  description: string
  footerLinksLabel: string
  forgotPassword: string
  noAccount: string
  signup: string
  submit: string
  title: string
}

export interface Login7Props extends AuthBaseProps<Login7Labels> {
  fieldErrors?: AuthFieldErrors<Login7Values>
  footerLinks?: Login7FooterLink[]
  forgotPasswordHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login7Values) => void
  providers?: AuthProvider[]
  signupHref?: string
}
