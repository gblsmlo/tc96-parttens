import {
  ResetPassword2,
  type ResetPassword2Props,
} from '@tc96/ui/blocks/application/auth/reset-password-2'
import { authLogo } from '../fixtures/auth-data'
import type { ResetPassword2Controls } from './reset-password-2-controls.ts'

interface ComposedResetPassword2Props extends ResetPassword2Controls {
  onRequestNewLink?: ResetPassword2Props['onRequestNewLink']
  onSubmit?: ResetPassword2Props['onSubmit']
}

const ignore = () => undefined

export const ComposedResetPassword2 = ({
  description,
  error,
  expiredDescription,
  expiredTitle,
  expiresIn,
  fieldError,
  loginHref,
  logo,
  onRequestNewLink = ignore,
  onSubmit = ignore,
  passwordMinLength,
  passwordSuggestions,
  pending,
  requestNewLink,
  requestNewLinkIn,
  submit,
  timer,
  title,
}: Readonly<ComposedResetPassword2Props>) => (
  <ResetPassword2
    error={error || undefined}
    expiresIn={timer ? expiresIn : undefined}
    fieldErrors={fieldError ? { password: fieldError } : undefined}
    labels={{ description, expiredDescription, expiredTitle, submit, title }}
    loginHref={loginHref ? '/login' : undefined}
    logo={logo ? authLogo : undefined}
    onRequestNewLink={requestNewLink ? onRequestNewLink : undefined}
    onSubmit={onSubmit}
    passwordMinLength={passwordMinLength}
    passwordSuggestions={passwordSuggestions}
    pending={pending}
    requestNewLinkIn={requestNewLinkIn}
  />
)
