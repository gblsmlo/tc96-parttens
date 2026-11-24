import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login8Values {
  email: string
}

export interface Login8Labels
  extends Pick<
    AuthCommonLabels,
    | 'email'
    | 'errorTitle'
    | 'providerContinue'
    | 'providersGroup'
    | 'providersSeparator'
  > {
  description: string
  emailHint: string
  submit: string
  title: string
}

export interface Login8Props extends AuthBaseProps<Login8Labels> {
  fieldErrors?: AuthFieldErrors<Login8Values>
  media?: ReactNode
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login8Values) => void
  providers?: AuthProvider[]
}
