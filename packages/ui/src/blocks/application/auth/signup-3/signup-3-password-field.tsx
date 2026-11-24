'use client'

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { type ReactElement, useState } from 'react'

export interface Signup3PasswordFieldProps {
  hideLabel: string
  label: string
  minLength?: number
  name: string
  placeholder?: string
  showLabel: string
}

export function Signup3PasswordField({
  hideLabel,
  label,
  minLength,
  name,
  placeholder,
  showLabel,
}: Readonly<Signup3PasswordFieldProps>): ReactElement {
  const [visible, setVisible] = useState(false)
  const toggleLabel = visible ? hideLabel : showLabel
  return (
    <Field name={name}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          autoComplete="new-password"
          minLength={minLength}
          placeholder={placeholder}
          required
          type={visible ? 'text' : 'password'}
        />
        <InputGroupAddon align="inline-end">
          <Button
            aria-label={toggleLabel}
            onClick={() => setVisible((current) => !current)}
            size="sm"
            title={toggleLabel}
            type="button"
            variant="ghost"
          >
            {visible ? <EyeSlashIcon aria-hidden /> : <EyeIcon aria-hidden />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldError />
    </Field>
  )
}
