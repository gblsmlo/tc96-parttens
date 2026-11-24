import {
  Signup1,
  type SignupProps,
} from '@tc96/ui/blocks/application/auth/signup-1'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { type SignupControls, signupSuggestions } from './signup-1-controls.ts'

type ComposedSignupProps = Readonly<
  SignupControls & Partial<Pick<SignupProps, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedSignup = ({
  emailError,
  error,
  login,
  logo,
  nameError,
  onProviderSelect,
  onSubmit = ignore,
  passwordError,
  passwordMinLength,
  pending,
  privacy,
  providers,
  suggestions,
  terms,
}: ComposedSignupProps) => (
  <Signup1
    error={error || undefined}
    fieldErrors={
      nameError || emailError || passwordError
        ? {
            email: emailError || undefined,
            name: nameError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    loginHref={login ? '/login' : undefined}
    logo={logo ? authLogo : undefined}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    passwordMinLength={passwordMinLength}
    passwordSuggestions={signupSuggestions[suggestions]}
    pending={pending}
    privacyHref={privacy ? '/privacy' : undefined}
    providers={providers ? authProviders : undefined}
    termsHref={terms ? '/terms' : undefined}
  />
)
