import {
  Login7,
  type Login7FooterLink,
  type Login7Props,
} from '@tc96/blocks/application/auth/login-7'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login7Controls } from './login-7-controls.ts'

type ComposedLogin7Props = Readonly<
  Login7Controls &
    Partial<Pick<Login7Props, 'onProviderSelect' | 'onSubmit' | 'providers'>>
>

const ignore = () => undefined

export const footerLinks: Login7FooterLink[] = [
  { href: '/privacy', label: 'Privacidade' },
  { href: '/terms', label: 'Termos' },
  { href: '/status', label: 'Status' },
]

export const ComposedLogin7 = ({
  emailError,
  error,
  footerLinks: showFooterLinks,
  onProviderSelect = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
  providers = authProviders,
}: ComposedLogin7Props) => (
  <Login7
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    footerLinks={showFooterLinks ? footerLinks : undefined}
    forgotPasswordHref="/forgot-password"
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={providers}
    signupHref="/signup"
  />
)
