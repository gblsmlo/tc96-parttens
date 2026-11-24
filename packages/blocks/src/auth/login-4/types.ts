import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
} from '../shared/types'

export interface Login4Values {
  email: string
}

export interface Login4Labels
  extends Pick<AuthCommonLabels, 'email' | 'errorTitle'> {
  description: string
  didNotReceive: string
  passwordLogin: string
  resend: string
  resendIn: (seconds: number) => string
  sentDescription: (destination?: string) => string
  sentTitle: string
  submit: string
  title: string
}

export interface Login4Props extends AuthBaseProps<Login4Labels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<Login4Values>
  onResend?: () => void
  onSubmit: (values: Login4Values) => void
  passwordLoginHref?: string
  resendIn?: number
  sent?: boolean
}
