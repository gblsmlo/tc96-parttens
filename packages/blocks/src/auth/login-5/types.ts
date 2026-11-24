import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
} from '../shared/types'

export interface Login5Method {
  icon?: ReactNode
  id: string
  label: string
}

export type Login5EmailMethod = 'email'

export interface Login5Values {
  email: string
  password: string
}

export interface Login5Labels
  extends Pick<
    AuthCommonLabels,
    'email' | 'errorTitle' | 'hidePassword' | 'password' | 'showPassword'
  > {
  backToMethods: string
  description: string
  emailDescription: string
  emailMethod: string
  emailTitle: string
  forgotPassword: string
  methodsGroup: string
  noAccount: string
  signup: string
  submit: string
  title: string
}

export interface Login5Props extends AuthBaseProps<Login5Labels> {
  fieldErrors?: AuthFieldErrors<Login5Values>
  forgotPasswordHref?: string
  method?: Login5EmailMethod
  methods: Login5Method[]
  onMethod: (id: string) => void
  onMethodChange?: (method: Login5EmailMethod | undefined) => void
  onSubmit: (values: Login5Values) => void
  signupHref?: string
}
