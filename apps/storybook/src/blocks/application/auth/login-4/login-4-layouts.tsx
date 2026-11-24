import { Login4, type Login4Props } from '@tc96/blocks/application/auth/login-4'
import { useState } from 'react'
import { authLogo, authProviders } from '../fixtures/auth-data'
import type { Login4Controls } from './login-4-controls.ts'

interface ComposedLogin4Props extends Login4Controls {
  onResend?: Login4Props['onResend']
  onSubmit?: Login4Props['onSubmit']
}

const ignore = () => undefined

export const ComposedLogin4 = ({
  destination,
  emailError,
  error,
  onResend = ignore,
  onSubmit = ignore,
  pending,
  resend,
  resendIn,
  sent,
}: Readonly<ComposedLogin4Props>) => (
  <Login4
    destination={destination || undefined}
    error={error || undefined}
    fieldErrors={emailError ? { email: emailError } : undefined}
    logo={authLogo}
    onResend={resend ? onResend : undefined}
    onSubmit={onSubmit}
    passwordLoginHref="/login"
    pending={pending}
    providers={authProviders}
    resendIn={resendIn}
    sent={sent}
  />
)

export function SendingLogin4(props: Readonly<Login4Props>) {
  const [destination, setDestination] = useState<string>()
  const [sent, setSent] = useState(false)
  return (
    <Login4
      {...props}
      destination={destination}
      onSubmit={(values) => {
        props.onSubmit(values)
        setDestination(values.email)
        setSent(true)
      }}
      sent={sent}
    />
  )
}
