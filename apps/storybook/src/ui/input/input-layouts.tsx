import { CheckIcon, EyeIcon, EyeSlashIcon, XIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Group } from '@tc96/ui/group'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import { Label } from '@tc96/ui/label'
import { useId, useState } from 'react'
import type { InputControls } from './input-controls.ts'

interface ComposedInputProps extends InputControls {
  className?: string
  id?: string
  name?: string
  required?: boolean
}

interface EmailFormProps {
  onSubmit?: (email: FormDataEntryValue | null) => void
}

export const ComposedInput = ({
  className,
  defaultValue,
  disabled,
  id,
  invalid,
  label,
  name,
  placeholder,
  required,
  size,
  type,
  unstyled,
}: Readonly<ComposedInputProps>) => (
  <Input
    aria-invalid={invalid || undefined}
    aria-label={label || undefined}
    className={className}
    defaultValue={defaultValue || undefined}
    disabled={disabled}
    id={id}
    key={defaultValue}
    name={name}
    placeholder={placeholder || undefined}
    required={required}
    size={size}
    type={type}
    unstyled={unstyled}
  />
)

export const LabeledInput = (props: Readonly<InputControls>) => {
  const id = useId()
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id}>Label text</Label>
      <ComposedInput {...props} id={id} label="" />
    </div>
  )
}

export const ButtonInput = (props: Readonly<InputControls>) => (
  <Group aria-label="Input with button" className="w-full gap-2">
    <ComposedInput {...props} className="flex-1" />
    <div>
      <Button type="button" variant="outline">
        Send
      </Button>
    </div>
  </Group>
)

export const FieldInput = (props: Readonly<InputControls>) => (
  <Field name="value">
    <FieldLabel>Label text</FieldLabel>
    <ComposedInput {...props} label="" required />
    <FieldError>Describe how to fix the value.</FieldError>
  </Field>
)

export const EmailForm = ({ onSubmit }: Readonly<EmailFormProps>) => (
  <Form
    className="flex w-full flex-col gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.(new FormData(event.currentTarget).get('email'))
    }}
  >
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="you@example.com" required type="email" />
      <FieldError>Please enter a valid email.</FieldError>
    </Field>
    <Button type="submit">Submit</Button>
  </Form>
)

export const textMaxLength = 14

export const CharacterCounterInput = () => {
  const [value, setValue] = useState('')
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Username"
        maxLength={textMaxLength}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter username"
        type="text"
        value={value}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupText
          aria-live="polite"
          className="text-xs tabular-nums"
          role="status"
        >
          {value.length}/{textMaxLength}
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

export const CharactersRemainingInput = () => {
  const id = useId()
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <Input
        aria-describedby={`${id}-description`}
        aria-label="Code"
        maxLength={textMaxLength}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter code"
        type="text"
        value={value}
      />
      <p className="text-muted-foreground text-sm" id={`${id}-description`}>
        <span className="tabular-nums">{textMaxLength - value.length}</span>{' '}
        characters left
      </p>
    </div>
  )
}

export const PasswordVisibilityInput = () => {
  const [visible, setVisible] = useState(false)
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Password"
        placeholder="Enter your password"
        type={visible ? 'text' : 'password'}
      />
      <InputGroupAddon align="inline-end">
        <Button
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
          size="sm"
          title={visible ? 'Hide password' : 'Show password'}
          type="button"
          variant="ghost"
        >
          {visible ? <EyeSlashIcon aria-hidden /> : <EyeIcon aria-hidden />}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  )
}

export const ClearButtonInput = () => {
  const [value, setValue] = useState('Lisbon')
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="City"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search cities"
        type="text"
        value={value}
      />
      {value ? (
        <InputGroupAddon align="inline-end">
          <Button
            aria-label="Clear city"
            onClick={() => setValue('')}
            size="sm"
            type="button"
            variant="ghost"
          >
            <XIcon aria-hidden />
          </Button>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}

const passwordRequirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[0-9]/, text: 'At least 1 number' },
  { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
  { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
] as const

const strengthLabel = (score: number) => {
  if (score === 0) return 'Enter a password'
  if (score <= 2) return 'Weak password'
  if (score === 3) return 'Medium password'
  return 'Strong password'
}

const strengthColor = (score: number) => {
  if (score === 0) return 'bg-border'
  if (score <= 1) return 'bg-red-500'
  if (score <= 2) return 'bg-orange-500'
  if (score === 3) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export const PasswordStrengthInput = () => {
  const id = useId()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const requirements = passwordRequirements.map((requirement) => ({
    ...requirement,
    met: requirement.regex.test(password),
  }))
  const score = requirements.filter((requirement) => requirement.met).length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>Password</Label>
        <InputGroup>
          <InputGroupInput
            aria-describedby={`${id}-description`}
            id={id}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type={visible ? 'text' : 'password'}
            value={password}
          />
          <InputGroupAddon align="inline-end">
            <Button
              aria-label={visible ? 'Hide password' : 'Show password'}
              onClick={() => setVisible((current) => !current)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {visible ? <EyeSlashIcon aria-hidden /> : <EyeIcon aria-hidden />}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div
        aria-label="Password strength"
        aria-valuemax={4}
        aria-valuemin={0}
        aria-valuenow={score}
        className="h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        tabIndex={-1}
      >
        <div
          className={`h-full ${strengthColor(score)} transition-all duration-500 ease-out`}
          style={{ width: `${(score / 4) * 100}%` }}
        />
      </div>

      <p
        className="font-medium text-foreground text-sm"
        id={`${id}-description`}
      >
        {strengthLabel(score)}. Must contain:
      </p>

      <ul aria-label="Password requirements" className="flex flex-col gap-1.5">
        {requirements.map((requirement) => (
          <li className="flex items-center gap-2" key={requirement.text}>
            {requirement.met ? (
              <CheckIcon aria-hidden className="size-4 text-emerald-500" />
            ) : (
              <XIcon aria-hidden className="size-4 text-muted-foreground/80" />
            )}
            <span
              className={`text-xs ${
                requirement.met ? 'text-emerald-600' : 'text-muted-foreground'
              }`}
              data-requirement={requirement.met ? 'met' : 'unmet'}
            >
              {requirement.text}
              <span className="sr-only">
                {requirement.met
                  ? ' - Requirement met'
                  : ' - Requirement not met'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
