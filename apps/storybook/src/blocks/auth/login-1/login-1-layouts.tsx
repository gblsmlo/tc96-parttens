import { Login1, type LoginProps } from '@tc96/blocks/auth/login-1'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { LoginControls } from './login-1-controls.ts'

type ComposedLoginProps = Readonly<
  LoginControls & Partial<Pick<LoginProps, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedLogin = ({
  emailError,
  error,
  forgotPassword,
  logo,
  onProviderSelect,
  onSubmit = ignore,
  passwordError,
  pending,
  providers,
  signup,
}: ComposedLoginProps) => (
  <Login1
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    forgotPasswordHref={forgotPassword ? '/forgot-password' : undefined}
    logo={logo ? authLogo : undefined}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={providers ? authProviders : undefined}
    signupHref={signup ? '/signup' : undefined}
  />
)
