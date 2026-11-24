import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
} from '../shared/types'

export interface ResetPasswordValues {
  password: string
}

export interface ResetPasswordLabels
  extends Pick<
      AuthCommonLabels,
      'errorTitle' | 'hidePassword' | 'showPassword'
    >,
    AuthNewPasswordLabels {
  backToLogin: string
  description: string
  newPassword: string
  submit: string
  title: string
}

export interface ResetPasswordProps extends AuthBaseProps<ResetPasswordLabels> {
  fieldErrors?: AuthFieldErrors<ResetPasswordValues>
  loginHref?: string
  onSubmit: (values: ResetPasswordValues) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
}
