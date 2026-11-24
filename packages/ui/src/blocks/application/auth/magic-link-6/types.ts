import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface MagicLink6Values {
  email: string
}

export interface MagicLink6Labels
  extends Pick<
    AuthCommonLabels,
    | 'email'
    | 'errorTitle'
    | 'providerContinue'
    | 'providersGroup'
    | 'providersSeparator'
  > {
  description: string
  didNotReceive: string
  mediaLabel: string
  noAccount: string
  resend: string
  resendIn: (seconds: number) => string
  sentDescription: (destination?: string) => string
  sentTitle: string
  signup: string
  submit: string
  title: string
  useAnotherEmail: string
}

export interface MagicLink6Props extends AuthBaseProps<MagicLink6Labels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<MagicLink6Values>
  media?: ReactNode
  onProviderSelect?: (id: string) => void
  onResend?: () => void
  onReset?: () => void
  onSubmit: (values: MagicLink6Values) => void
  providers?: AuthProvider[]
  showProviders?: boolean
  signupHref?: string
  resendIn?: number
  sent?: boolean
}
