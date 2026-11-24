import {
  ResetPassword1,
  type ResetPasswordProps,
} from '@tc96/ui/blocks/application/auth/reset-password-1'
import { authLogo } from '../fixtures/auth-data'
import type { ResetPasswordControls } from './reset-password-1-controls.ts'

interface ComposedResetPassword1Props extends ResetPasswordControls {
  onSubmit?: ResetPasswordProps['onSubmit']
}

const ignoreSubmit = () => undefined

export const ComposedResetPassword1 = ({
  description,
  error,
  fieldError,
  loginHref,
  logo,
  onSubmit = ignoreSubmit,
  passwordMinLength,
  passwordSuggestions,
  pending,
  submit,
  title,
}: Readonly<ComposedResetPassword1Props>) => (
  <ResetPassword1
    error={error || undefined}
    fieldErrors={fieldError ? { password: fieldError } : undefined}
    labels={{ description, submit, title }}
    loginHref={loginHref ? '/login' : undefined}
    logo={logo ? authLogo : undefined}
    onSubmit={onSubmit}
    passwordMinLength={passwordMinLength}
    passwordSuggestions={passwordSuggestions}
    pending={pending}
  />
)
