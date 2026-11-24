import {
  Login6,
  type Login6Props,
} from '@tc96/ui/blocks/application/auth/login-6'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login6Controls } from './login-6-controls.ts'

type ComposedLogin6Props = Readonly<
  Login6Controls &
    Partial<Pick<Login6Props, 'onProviderSelect' | 'onSubmit' | 'providers'>>
>

const ignore = () => undefined

export const gradientMedia = (
  <div className="size-full min-h-96 bg-linear-to-br from-primary/80 via-primary/40 to-muted" />
)

export const ComposedLogin6 = ({
  emailError,
  error,
  media,
  onProviderSelect = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
  providers = authProviders,
}: ComposedLogin6Props) => (
  <Login6
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    media={media ? gradientMedia : undefined}
    forgotPasswordHref="/forgot-password"
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={providers}
    signupHref="/signup"
  />
)
