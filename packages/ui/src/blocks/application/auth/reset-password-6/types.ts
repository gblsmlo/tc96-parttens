import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthNewPasswordLabels,
  AuthPasswordSuggestion,
} from '../shared/types'

export interface ResetPassword6Values {
  password: string
}

export interface ResetPassword6Labels
  extends Pick<
      AuthCommonLabels,
      'errorTitle' | 'hidePassword' | 'showPassword'
    >,
    AuthNewPasswordLabels {
  backToLogin: string
  description: string
  mediaLabel: string
  newPassword: string
  submit: string
  title: string
}

export interface ResetPassword6Props
  extends AuthBaseProps<ResetPassword6Labels> {
  fieldErrors?: AuthFieldErrors<ResetPassword6Values>
  loginHref?: string
  media?: ReactNode
  onSubmit: (values: ResetPassword6Values) => void
  passwordMinLength?: number
  passwordSuggestions?: AuthPasswordSuggestion[]
}
