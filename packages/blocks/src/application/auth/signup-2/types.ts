import type {
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
} from '../shared/types'

export interface Signup2Values {
  name: string
  email: string
  password: string
}

export interface Signup2Labels
  extends Pick<
      AuthCommonLabels,
      'email' | 'errorTitle' | 'hidePassword' | 'password' | 'showPassword'
    >,
    AuthNewPasswordLabels {
  description: string
  name: string
  submit: string
  title: string
}

export interface Signup2Props {
  error?: string
  fieldErrors?: AuthFieldErrors<Signup2Values>
  labels?: Partial<Signup2Labels>
  onSubmit: (values: Signup2Values) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
  pending?: boolean
}
