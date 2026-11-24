import {
  ForgotPassword1,
  type ForgotPasswordProps,
} from '@tc96/blocks/application/auth/forgot-password-1'
import { useState } from 'react'
import { authLogo } from '../fixtures/auth-data'
import type { ForgotPassword1Controls } from './forgot-password-1-controls.ts'

interface ComposedForgotPassword1Props extends ForgotPassword1Controls {
  onResend?: ForgotPasswordProps['onResend']
  onSubmit?: ForgotPasswordProps['onSubmit']
}

const ignore = () => undefined

export const ComposedForgotPassword1 = ({
  description,
  destination,
  emailError,
  error,
  loginHref,
  logo,
  onResend = ignore,
  onSubmit = ignore,
  pending,
  resend,
  resendIn,
  sent,
  sentTitle,
  submit,
  title,
}: Readonly<ComposedForgotPassword1Props>) => (
  <ForgotPassword1
    destination={destination || undefined}
    error={error || undefined}
    fieldErrors={emailError ? { email: emailError } : undefined}
    labels={{ description, sentTitle, submit, title }}
    loginHref={loginHref ? '/login' : undefined}
    logo={logo ? authLogo : undefined}
    onResend={resend ? onResend : undefined}
    onSubmit={onSubmit}
    pending={pending}
    resendIn={resendIn}
    sent={sent}
  />
)

export function SendingForgotPassword(props: Readonly<ForgotPasswordProps>) {
  const [destination, setDestination] = useState<string>()
  const [sent, setSent] = useState(false)
  return (
    <ForgotPassword1
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
