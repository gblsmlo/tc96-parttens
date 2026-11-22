import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
  AuthProvider,
} from '../shared/types'

export interface SignupValues {
  name: string
  email: string
  password: string
}

export interface SignupLabels extends AuthCommonLabels, AuthNewPasswordLabels {
  description: string
  hasAccount: string
  login: string
  name: string
  privacy: string
  submit: string
  submitPending: string
  terms: string
  termsAnd: string
  termsLead: string
  title: string
}

export interface SignupProps extends AuthBaseProps<SignupLabels> {
  fieldErrors?: AuthFieldErrors<SignupValues>
  loginHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: SignupValues) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
  privacyHref?: string
  providers?: AuthProvider[]
  termsHref?: string
}
