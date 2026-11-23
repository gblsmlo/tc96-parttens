import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
} from '../shared/types'

export interface ForgotPasswordValues {
  email: string
}

export interface ForgotPasswordLabels
  extends Pick<AuthCommonLabels, 'email' | 'errorTitle'> {
  backToLogin: string
  description: string
  didNotReceive: string
  resend: string
  resendIn: (seconds: number) => string
  sentDescription: (destination?: string) => string
  sentTitle: string
  submit: string
  submitPending: string
  title: string
}

export interface ForgotPasswordProps
  extends AuthBaseProps<ForgotPasswordLabels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<ForgotPasswordValues>
  loginHref?: string
  onResend?: () => void
  onSubmit: (values: ForgotPasswordValues) => void
  resendIn?: number
  sent?: boolean
}
