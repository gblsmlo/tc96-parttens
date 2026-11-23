import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface LoginValues {
  email: string
  password: string
  remember: boolean
}

export interface LoginLabels extends AuthCommonLabels {
  description: string
  forgotPassword: string
  noAccount: string
  remember: string
  signup: string
  submit: string
  title: string
}

export interface LoginProps extends AuthBaseProps<LoginLabels> {
  fieldErrors?: AuthFieldErrors<LoginValues>
  forgotPasswordHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: LoginValues) => void
  providers?: AuthProvider[]
  signupHref?: string
}
