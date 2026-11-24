import {
  ForgotPassword2,
  type ForgotPassword2Props,
} from '@tc96/ui/blocks/application/auth/forgot-password-2'
import { useState } from 'react'
import type { ForgotPassword2Controls } from './forgot-password-2-controls.ts'

interface ComposedForgotPassword2Props extends ForgotPassword2Controls {
  onSubmit?: ForgotPassword2Props['onSubmit']
}

const ignore = () => undefined

export const ComposedForgotPassword2 = ({
  description,
  destination,
  emailError,
  error,
  onSubmit = ignore,
  pending,
  sent,
  sentTitle,
  submit,
  title,
}: Readonly<ComposedForgotPassword2Props>) => (
  <ForgotPassword2
    destination={destination || undefined}
    error={error || undefined}
    fieldErrors={emailError ? { email: emailError } : undefined}
    labels={{ description, sentTitle, submit, title }}
    onSubmit={onSubmit}
    pending={pending}
    sent={sent}
  />
)

export function SendingForgotPassword2(props: Readonly<ForgotPassword2Props>) {
  const [destination, setDestination] = useState<string>()
  const [sent, setSent] = useState(false)
  return (
    <ForgotPassword2
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
