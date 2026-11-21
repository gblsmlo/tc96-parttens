import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@tc96/ui/field'
import { Form } from '@tc96/ui/form'
import { Input } from '@tc96/ui/input'
import { expect, within } from 'storybook/test'
import { FormCanvas } from './form-frame.tsx'
import { NewProjectForm } from './form-layouts.tsx'

const meta = {
  decorators: [FormCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Form/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => (
    <Form
      aria-label="Sign in"
      className="flex flex-col gap-4"
      onFormSubmit={() => undefined}
    >
      <Field name="email">
        <FieldLabel>Work email</FieldLabel>
        <Input
          autoComplete="email"
          placeholder="ada@acme.com"
          required
          type="email"
        />
        <FieldError>Enter the email you signed up with.</FieldError>
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <Input autoComplete="current-password" required type="password" />
        <FieldError>Enter your password.</FieldError>
      </Field>
      <Button type="submit">Sign in</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', { name: 'Sign in' })
    await expect(
      within(form).getByRole('textbox', { name: 'Work email' }),
    ).toBeRequired()
    await expect(within(form).getByLabelText('Password')).toHaveAttribute(
      'type',
      'password',
    )
  },
}

export const NewProject: Story = {
  render: () => <NewProjectForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Project name' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('The total for the whole project.'),
    ).toBeVisible()
  },
}

export const EmailTaken: Story = {
  render: () => (
    <Form
      className="flex flex-col gap-4"
      errors={{ email: 'ada@acme.com already belongs to a member.' }}
      onFormSubmit={() => undefined}
    >
      <Field name="email">
        <FieldLabel>Invite by email</FieldLabel>
        <Input defaultValue="ada@acme.com" required type="email" />
        <FieldDescription>They join the Design workspace.</FieldDescription>
        <FieldError />
      </Field>
      <Button type="submit">Send invite</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('ada@acme.com already belongs to a member.'),
    ).toBeVisible()
  },
}

export const Newsletter: Story = {
  render: () => (
    <Form className="flex items-start gap-2" onFormSubmit={() => undefined}>
      <Field className="flex-1" name="email">
        <FieldLabel className="sr-only">Email</FieldLabel>
        <Input placeholder="you@acme.com" required type="email" />
        <FieldDescription>One product update a month.</FieldDescription>
        <FieldError>Enter an email to subscribe.</FieldError>
      </Field>
      <Button type="submit">Subscribe</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Subscribe' }),
    ).toBeVisible()
  },
}
