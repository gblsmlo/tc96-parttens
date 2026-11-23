import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
} from '../shared/types'

export interface ResetPassword2Values {
  password: string
}

export interface ResetPassword2Labels
  extends Pick<
      AuthCommonLabels,
      'errorTitle' | 'hidePassword' | 'showPassword'
    >,
    AuthNewPasswordLabels {
  backToLogin: string
  description: string
  expiredDescription: string
  expiredTitle: string
  expiringSoon: string
  linkExpiresIn: (time: string) => string
  newPassword: string
  requestNewLink: string
  requestNewLinkIn: (time: string) => string
  submit: string
  title: string
}

export interface ResetPassword2Props
  extends AuthBaseProps<ResetPassword2Labels> {
  expiresIn?: number
  fieldErrors?: AuthFieldErrors<ResetPassword2Values>
  loginHref?: string
  onRequestNewLink?: () => void
  onSubmit: (values: ResetPassword2Values) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
  requestNewLinkIn?: number
}
