import type { AuthCommonLabels, AuthFieldErrors } from '../shared/types'

export interface Login2Values {
  email: string
  password: string
}

export interface Login2Labels
  extends Pick<
    AuthCommonLabels,
    'email' | 'errorTitle' | 'hidePassword' | 'password' | 'showPassword'
  > {
  description: string
  submit: string
  title: string
}

export interface Login2Props {
  error?: string
  fieldErrors?: AuthFieldErrors<Login2Values>
  labels?: Partial<Login2Labels>
  onSubmit: (values: Login2Values) => void
  pending?: boolean
}
