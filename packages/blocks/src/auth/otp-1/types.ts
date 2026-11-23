import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
} from '../shared/types'

export interface OtpValues {
  code: string
}

export interface OtpLabels extends Pick<AuthCommonLabels, 'errorTitle'> {
  code: string
  description: (length: number, destination?: string) => string
  didNotReceive: string
  digit: (position: number, total: number) => string
  resend: string
  resendIn: (seconds: number) => string
  submit: string
  submitPending: string
  title: string
}

export interface OtpProps extends AuthBaseProps<OtpLabels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<OtpValues>
  length?: number
  onComplete?: (code: string) => void
  onResend?: () => void
  onSubmit: (values: OtpValues) => void
  resendIn?: number
}
