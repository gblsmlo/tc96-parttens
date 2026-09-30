import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import {
  Button,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  Input,
} from 'tc96/ui'

const meta = {
  title: 'UI/Field/Patterns',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function CompleteFormPattern(): React.ReactElement {
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmittedName(String(data.get('fullName') ?? ''))
  }

  return (
    <Form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit}>
      <Field name="fullName">
        <FieldLabel>
          Full name
          <span aria-hidden className="text-destructive-foreground">
            *
          </span>
        </FieldLabel>
        <Input placeholder="Ada Lovelace" required type="text" />
        <FieldError>Please enter your full name.</FieldError>
      </Field>

      <Field name="email">
        <FieldLabel>
          Email
          <span aria-hidden className="text-destructive-foreground">
            *
          </span>
        </FieldLabel>
        <Input placeholder="ada@example.com" required type="email" />
        <FieldDescription>Used for account notifications.</FieldDescription>
        <FieldError>Please enter a valid email.</FieldError>
      </Field>

      <Field name="team">
        <FieldLabel>Team</FieldLabel>
        <Input placeholder="Analytical Engine" type="text" />
        <FieldDescription>This field is optional.</FieldDescription>
      </Field>

      <Button size="md" type="submit">
        Create account
      </Button>

      {submittedName ? (
        <output aria-live="polite" className="text-muted-foreground text-sm">
          Account ready for {submittedName}.
        </output>
      ) : null}
    </Form>
  )
}

function InputFormPattern(): React.ReactElement {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmittedEmail(String(data.get('email') ?? ''))
  }

  return (
    <Form className="flex w-80 flex-col gap-4" onSubmit={handleSubmit}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="you@example.com" required type="email" />
        <FieldError>Please enter a valid email.</FieldError>
      </Field>
      <Button size="md" type="submit">
        Submit
      </Button>
      {submittedEmail ? (
        <output aria-live="polite" className="text-muted-foreground text-sm">
          Submitted {submittedEmail}.
        </output>
      ) : null}
    </Form>
  )
}

export const WithDescription: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel>Name</FieldLabel>
      <Input placeholder="Enter your name" type="text" />
      <FieldDescription>Visible on your profile.</FieldDescription>
    </Field>
  ),
}

export const WithRequiredIndicator: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel>
        Password
        <span aria-hidden className="text-destructive-foreground">
          *
        </span>
      </FieldLabel>
      <Input placeholder="Enter password" required type="password" />
      <FieldError>Please fill out this field.</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByPlaceholderText('Enter password')
    await expect(input).toBeRequired()
    await expect(input).toHaveAccessibleName('Password')
  },
}

export const CompleteFormBuiltWithField: Story = {
  render: () => <CompleteFormPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Full name' }), 'Ada Lovelace')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'ada@example.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Account ready for Ada Lovelace.')
  },
}

export const InputInAForm: Story = {
  render: () => <InputFormPattern />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole('textbox', { name: 'Email' }), 'team@tc96.dev')
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Submitted team@tc96.dev.')
  },
}
