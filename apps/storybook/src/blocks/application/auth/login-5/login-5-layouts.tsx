import { FingerprintIcon, KeyIcon } from '@phosphor-icons/react'
import {
  Login5,
  type Login5EmailMethod,
  type Login5Method,
  type Login5Props,
} from '@tc96/ui/blocks/application/auth/login-5'
import { useState } from 'react'
import { authLogo } from '../fixtures/auth-data'
import type { Login5Controls } from './login-5-controls.ts'

export const loginMethods: Login5Method[] = [
  {
    icon: <FingerprintIcon aria-hidden="true" />,
    id: 'passkey',
    label: 'Entrar com chave de acesso',
  },
  {
    icon: <KeyIcon aria-hidden="true" />,
    id: 'sso',
    label: 'Entrar com SSO',
  },
]

type ComposedLogin5Props = Readonly<
  Login5Controls &
    Partial<Pick<Login5Props, 'onMethod' | 'onMethodChange' | 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedLogin5 = ({
  emailError,
  error,
  method,
  onMethod = ignore,
  onMethodChange = ignore,
  onSubmit = ignore,
  passwordError,
  pending,
}: ComposedLogin5Props) => (
  <Login5
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
    method={method || undefined}
    methods={loginMethods}
    onMethod={onMethod}
    onMethodChange={onMethodChange}
    onSubmit={onSubmit}
    pending={pending}
    signupHref="/signup"
  />
)

export function PickingLogin5(props: Readonly<Login5Props>) {
  const [method, setMethod] = useState<Login5EmailMethod | undefined>(
    props.method,
  )
  return (
    <Login5
      {...props}
      method={method}
      onMethodChange={(next) => {
        props.onMethodChange?.(next)
        setMethod(next)
      }}
    />
  )
}
