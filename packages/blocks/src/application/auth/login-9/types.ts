import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login9Values {
  email: string
}

export interface Login9TestimonialAuthor {
  avatarFallback: string
  avatarSrc?: string
  name: string
  role?: string
}

export interface Login9Testimonial {
  author: Login9TestimonialAuthor
  quote: string
  rating?: number
}

export interface Login9Labels
  extends Pick<
    AuthCommonLabels,
    | 'email'
    | 'errorTitle'
    | 'providerContinue'
    | 'providersGroup'
    | 'providersSeparator'
  > {
  asideLabel: string
  description: string
  emailHint: string
  rating: (stars: number) => string
  submit: string
  title: string
}

export interface Login9Props extends AuthBaseProps<Login9Labels> {
  brands?: ReactNode
  brandsLabel?: string
  fieldErrors?: AuthFieldErrors<Login9Values>
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login9Values) => void
  providers?: AuthProvider[]
  testimonial?: Login9Testimonial
}
