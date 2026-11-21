import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Label } from '@tc96/ui/label'
import { Textarea } from '@tc96/ui/textarea'
import { useId, useState } from 'react'
import type { TextareaControls } from './textarea-controls.ts'

interface ComposedTextareaProps extends TextareaControls {
  className?: string
  id?: string
  name?: string
}

interface SupportFormProps {
  onSubmit?: (message: FormDataEntryValue | null) => void
}

export const ComposedTextarea = ({
  className,
  defaultValue,
  disabled,
  id,
  invalid,
  label,
  name,
  placeholder,
  size,
  unstyled,
}: Readonly<ComposedTextareaProps>) => (
  <Textarea
    aria-invalid={invalid || undefined}
    aria-label={label || undefined}
    className={className}
    defaultValue={defaultValue || undefined}
    disabled={disabled}
    id={id}
    key={defaultValue}
    name={name}
    placeholder={placeholder || undefined}
    size={size}
    unstyled={unstyled}
  />
)

export const LabeledTextarea = (props: Readonly<TextareaControls>) => {
  const id = useId()
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor={id}>Label text</Label>
      <ComposedTextarea {...props} id={id} label="" />
    </div>
  )
}

export const FieldTextarea = (props: Readonly<TextareaControls>) => (
  <Field name="value">
    <FieldLabel>Label text</FieldLabel>
    <ComposedTextarea {...props} label="" />
    <FieldDescription>Describe what the field is for.</FieldDescription>
  </Field>
)

export const ButtonTextarea = (props: Readonly<TextareaControls>) => (
  <div className="flex flex-col items-end gap-2">
    <ComposedTextarea {...props} />
    <Button type="button">Send</Button>
  </div>
)

export const SupportForm = ({ onSubmit }: Readonly<SupportFormProps>) => (
  <Form
    className="flex w-full flex-col gap-4"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.(new FormData(event.currentTarget).get('message'))
    }}
  >
    <Field name="message">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Tell us what went wrong" required />
      <FieldError>Please describe the problem.</FieldError>
    </Field>
    <Button type="submit">Send message</Button>
  </Form>
)

export const releaseNotesMaxLength = 200

export const ReleaseNotesTextarea = () => {
  const [value, setValue] = useState('')
  return (
    <Field name="notes">
      <FieldLabel>Release notes</FieldLabel>
      <Textarea
        maxLength={releaseNotesMaxLength}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What changed in this version?"
        value={value}
      />
      <FieldDescription className="tabular-nums">
        {value.length}/{releaseNotesMaxLength} characters
      </FieldDescription>
    </Field>
  )
}
