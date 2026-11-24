import { Login8, type Login8Props } from '@tc96/blocks/application/auth/login-8'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login8Controls } from './login-8-controls.ts'

type ComposedLogin8Props = Readonly<
  Login8Controls & Partial<Pick<Login8Props, 'onProviderSelect' | 'onSubmit'>>
>

const ignore = () => undefined

export const login8Media = (
  <div className="flex size-full items-end bg-muted p-10">
    <p className="max-w-sm font-medium text-xl">
      Tudo o que o seu time precisa, em um só lugar.
    </p>
  </div>
)

export const ComposedLogin8 = ({
  emailError,
  error,
  media,
  onProviderSelect = ignore,
  onSubmit = ignore,
  pending,
  providers,
}: ComposedLogin8Props) => (
  <Login8
    error={error || undefined}
    fieldErrors={emailError ? { email: emailError } : undefined}
    logo={authLogo}
    media={media ? login8Media : undefined}
    onProviderSelect={onProviderSelect}
    onSubmit={onSubmit}
    pending={pending}
    providers={providers ? authProviders : undefined}
  />
)
