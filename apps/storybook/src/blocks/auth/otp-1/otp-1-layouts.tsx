import { Otp1, type OtpProps } from '@tc96/blocks/auth/otp-1'
import { authLogo } from '../fixtures/auth-data'
import type { OtpControls } from './otp-1-controls.ts'

type ComposedOtpProps = Readonly<
  OtpControls &
    Partial<Pick<OtpProps, 'length' | 'onComplete' | 'onResend' | 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedOtp = ({
  codeError,
  destination,
  error,
  length,
  logo,
  onComplete,
  onResend = ignore,
  onSubmit = ignore,
  pending,
  resend,
  resendIn,
}: ComposedOtpProps) => (
  <Otp1
    destination={destination || undefined}
    error={error || undefined}
    fieldErrors={codeError ? { code: codeError } : undefined}
    length={length}
    logo={logo ? authLogo : undefined}
    onComplete={onComplete}
    onResend={resend ? onResend : undefined}
    onSubmit={onSubmit}
    pending={pending}
    resendIn={resendIn}
  />
)
