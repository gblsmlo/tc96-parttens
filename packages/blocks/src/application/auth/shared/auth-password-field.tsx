'use client'

import { Button } from '@tc96/ui/button'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@tc96/ui/input-group'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { type ReactElement, type ReactNode, useState } from 'react'

export interface AuthPasswordFieldProps {
  autoComplete: 'current-password' | 'new-password'
  children?: ReactNode
  hideLabel: string
  label: string
  minLength?: number
  name: string
  onValueChange?: (value: string) => void
  required?: boolean
  showLabel: string
}

export function AuthPasswordField({
  autoComplete,
  children,
  hideLabel,
  label,
  minLength,
  name,
  onValueChange,
  required = true,
  showLabel,
}: Readonly<AuthPasswordFieldProps>): ReactElement {
  const [visible, setVisible] = useState(false)
  const toggleLabel = visible ? hideLabel : showLabel
  return (
    <Field name={name}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          autoComplete={autoComplete}
          minLength={minLength}
          onValueChange={onValueChange}
          required={required}
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
            {visible ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldError />
      {children}
    </Field>
  )
}
