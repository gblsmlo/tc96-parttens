import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@tc96/ui/dialog'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form, type FormPrimitive } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { useState } from 'react'
import { z } from 'zod'
import type { FormControls } from './form-controls.ts'

type SubmitHandler = (
  values: Record<string, unknown>,
  details: FormPrimitive.SubmitEventDetails,
) => void

interface SubmitLayoutProps {
  onFormSubmit?: SubmitHandler
}

const ignoreSubmit: SubmitHandler = () => undefined

export const ComposedForm = ({
  description,
  error,
  errors,
  label,
  onFormSubmit,
  submitLabel,
  validationMode,
}: Readonly<FormControls>) => (
  <Form
    className="flex flex-col gap-4"
    errors={errors ? { email: errors } : undefined}
    onFormSubmit={onFormSubmit}
    validationMode={validationMode}
  >
    <Field name="email">
      <FieldLabel>{label}</FieldLabel>
      <Input placeholder="you@example.com" required type="email" />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {errors ? <FieldError /> : <FieldError>{error}</FieldError>}
    </Field>
    <Button type="submit">{submitLabel}</Button>
  </Form>
)

export const SeveralFieldsForm = ({
  onFormSubmit = ignoreSubmit,
}: Readonly<SubmitLayoutProps>) => (
  <Form className="flex flex-col gap-4" onFormSubmit={onFormSubmit}>
    <Field name="name">
      <FieldLabel>Name</FieldLabel>
      <Input required type="text" />
      <FieldError>Enter a name.</FieldError>
    </Field>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="you@example.com" required type="email" />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
    <Button type="submit">Submit</Button>
  </Form>
)

export const InlineForm = () => (
  <Form className="flex items-start gap-2" onFormSubmit={ignoreSubmit}>
    <Field className="flex-1" name="email">
      <FieldLabel className="sr-only">Email</FieldLabel>
      <Input placeholder="you@example.com" required type="email" />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
    <Button type="submit">Submit</Button>
  </Form>
)

export const DialogForm = () => (
  <Dialog defaultOpen>
    <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Describe what the form changes.</DialogDescription>
      </DialogHeader>
      <Form className="contents" onFormSubmit={ignoreSubmit}>
        <DialogPanel>
          <Field name="email">
            <FieldLabel>Email</FieldLabel>
            <Input placeholder="you@example.com" required type="email" />
            <FieldError>Enter a valid email address.</FieldError>
          </Field>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </Form>
    </DialogPopup>
  </Dialog>
)

const projectSchema = z.object({
  budget: z.coerce
    .number<string>({ error: 'Enter the budget as a number.' })
    .positive('Enter a budget above zero.'),
  name: z.string().trim().min(1, 'Enter a project name.'),
})

type FormErrors = Record<string, string | string[]>

export const NewProjectForm = ({
  onFormSubmit,
}: Readonly<SubmitLayoutProps>) => {
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit: SubmitHandler = (values, details) => {
    const result = projectSchema.safeParse(values)
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors)
      return
    }
    setErrors({})
    onFormSubmit?.(result.data, details)
  }

  return (
    <Form
      className="flex flex-col gap-4"
      errors={errors}
      onFormSubmit={handleSubmit}
    >
      <Field name="name">
        <FieldLabel>Project name</FieldLabel>
        <Input placeholder="Website redesign" type="text" />
        <FieldError />
      </Field>
      <Field name="budget">
        <FieldLabel>Budget (USD)</FieldLabel>
        <Input inputMode="decimal" placeholder="12000" type="text" />
        <FieldDescription>The total for the whole project.</FieldDescription>
        <FieldError />
      </Field>
      <Button type="submit">Create project</Button>
    </Form>
  )
}
