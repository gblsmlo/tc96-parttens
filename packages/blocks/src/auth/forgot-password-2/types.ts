import type { AuthCommonLabels, AuthFieldErrors } from '../shared/types'

export interface ForgotPassword2Values {
  email: string
}

export interface ForgotPassword2Labels
  extends Pick<AuthCommonLabels, 'email' | 'errorTitle'> {
  description: string
  sentDescription: (destination?: string) => string
  sentTitle: string
  submit: string
  title: string
}

export interface ForgotPassword2Props {
  destination?: string
  error?: string
  fieldErrors?: AuthFieldErrors<ForgotPassword2Values>
  labels?: Partial<ForgotPassword2Labels>
  onSubmit: (values: ForgotPassword2Values) => void
  pending?: boolean
  sent?: boolean
}
