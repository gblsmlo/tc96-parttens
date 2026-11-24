import {
  Signup2,
  type Signup2Props,
} from '@tc96/ui/blocks/application/auth/signup-2'
import {
  type Signup2Controls,
  signup2Suggestions,
} from './signup-2-controls.ts'

type ComposedSignup2Props = Readonly<
  Signup2Controls & Partial<Pick<Signup2Props, 'onSubmit'>>
>

const ignore = () => undefined

export const ComposedSignup2 = ({
  emailError,
  error,
  nameError,
  onSubmit = ignore,
  passwordError,
  passwordMinLength,
  pending,
  suggestions,
}: ComposedSignup2Props) => (
  <Signup2
    error={error || undefined}
    fieldErrors={
      nameError || emailError || passwordError
        ? {
            email: emailError || undefined,
            name: nameError || undefined,
            password: passwordError || undefined,
          }
        : undefined
    }
    onSubmit={onSubmit}
    passwordMinLength={passwordMinLength}
    passwordSuggestions={signup2Suggestions[suggestions]}
    pending={pending}
  />
)
