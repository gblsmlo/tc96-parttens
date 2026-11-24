import { Login2, type Login2Props } from '@tc96/blocks/application/auth/login-2'
import type { Login2Controls } from './login-2-controls.ts'

type ComposedLogin2Props = Readonly<
  Login2Controls & Partial<Pick<Login2Props, 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedLogin2 = ({
  emailError,
  error,
  onSubmit = ignore,
  passwordError,
  pending,
}: ComposedLogin2Props) => (
  <Login2
    error={error || undefined}
    fieldErrors={
      emailError || passwordError
        ? {
            email: emailError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    onSubmit={onSubmit}
    pending={pending}
  />
)
