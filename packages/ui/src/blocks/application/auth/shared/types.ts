import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export type AuthRenderLink = RenderLink

export interface AuthProvider {
  icon?: ReactNode
  id: string
  label: string
}

export type AuthFieldErrors<TValues> = Partial<Record<keyof TValues, string>>

export type AuthPasswordSuggestion =
  | 'lowercase'
  | 'uppercase'
  | 'number'
  | 'symbol'

export interface AuthCommonLabels {
  email: string
  errorTitle: string
  hidePassword: string
  password: string
  providerContinue: (label: string) => string
  providersGroup: string
  providersSeparator: string
  showPassword: string
}

export interface AuthNewPasswordLabels {
  confirmPassword: string
  passwordMismatch: string
  suggestionLowercase: string
  suggestionMet: string
  suggestionMissing: string
  suggestionNumber: string
  suggestionSymbol: string
  suggestionUppercase: string
}

export interface AuthBaseProps<TLabels> {
  error?: string
  labels?: Partial<TLabels>
  logo?: ReactNode
  pending?: boolean
  renderLink?: AuthRenderLink
}
