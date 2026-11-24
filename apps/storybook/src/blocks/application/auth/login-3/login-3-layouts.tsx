import { Login3, type Login3Props } from '@tc96/blocks/application/auth/login-3'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login3Controls } from './login-3-controls.ts'

type ComposedLogin3Props = Readonly<
  Login3Controls & Partial<Pick<Login3Props, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const testimonial = (
  <figure className="flex max-w-md flex-col gap-4">
    <blockquote className="font-medium text-xl">
      Em uma semana, o time passou a resolver tudo em um só lugar.
    </blockquote>
    <figcaption className="text-muted-foreground text-sm">
      Ana Souza, diretora de operações na Acme
    </figcaption>
  </figure>
)

export const ComposedLogin3 = ({
  aside,
  emailError,
  error,
  onProviderSelect = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
}: ComposedLogin3Props) => (
  <Login3
    aside={aside ? testimonial : undefined}
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    forgotPasswordHref="/forgot-password"
    logo={authLogo}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={authProviders}
    signupHref="/signup"
  />
)
