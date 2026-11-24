import type { ReactNode } from 'react'
import type {
  AuthBaseProps,
  AuthCommonLabels,
  AuthFieldErrors,
  AuthProvider,
} from '../shared/types'

export interface Login10Values {
  email: string
  password: string
}

export interface Login10Testimonial {
  avatar?: ReactNode
  name: string
  quote: string
  role: string
}

export interface Login10FooterLink {
  href: string
  label: string
}

export interface Login10Labels extends AuthCommonLabels {
  asideDescription: string
  asideHeading: string
  asideLabel: string
  description: string
  footerLinks: string
  forgotPassword: string
  noAccount: string
  showTestimonial: (name: string) => string
  signup: string
  submit: string
  testimonials: string
  title: string
}

export interface Login10Props extends AuthBaseProps<Login10Labels> {
  copyright?: string
  fieldErrors?: AuthFieldErrors<Login10Values>
  footerLinks?: Login10FooterLink[]
  forgotPasswordHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: Login10Values) => void
  proof?: string
  providers?: AuthProvider[]
  rating?: ReactNode
  signupHref?: string
  testimonials?: Login10Testimonial[]
}
