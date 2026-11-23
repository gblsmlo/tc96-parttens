import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResetPassword1,
  type ResetPasswordProps,
} from '@tc96/blocks/auth/reset-password-1'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo } from '../../fixtures/auth-data'
import {
  confirmField,
  fillPasswords,
  passwordField,
  submitButton,
} from '../reset-password-1-play.ts'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onSubmit: fn(),
  },
  component: ResetPassword1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/ResetPassword/ResetPassword1/Behavior',
} satisfies Meta<typeof ResetPassword1>

export default meta

type Story = StoryObj<typeof meta>

function ExpiredLinkReset(props: Readonly<ResetPasswordProps>) {
  const [error, setError] = useState<string>()
  return (
    <ResetPassword1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('O link de redefinição expirou. Peça um novo link.')
      }}
    />
  )
}

function RejectedReset(props: Readonly<ResetPasswordProps>) {
  const [fieldErrors, setFieldErrors] =
    useState<ResetPasswordProps['fieldErrors']>()
  return (
    <ResetPassword1
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ password: 'Escolha uma senha diferente da anterior.' })
      }}
    />
  )
}

export const FieldErrorMarksPassword: Story = {
  args: {
    fieldErrors: { password: 'Escolha uma senha diferente da anterior.' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Escolha uma senha diferente da anterior.'),
    ).toBeVisible()
    await expect(confirmField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
  },
}

export const FieldErrorFocusesPassword: Story = {
  render: (args) => <RejectedReset {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(passwordField(canvas)).toHaveFocus())
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(passwordField(canvas)).toHaveAccessibleDescription(
      /Escolha uma senha diferente da anterior\./,
    )
    await expect(confirmField(canvas)).not.toHaveAttribute(
      'aria-invalid',
      'true',
    )
  },
}

export const ErrorShownInAlert: Story = {
  args: { error: 'O link de redefinição expirou. Peça um novo link.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'O link de redefinição expirou. Peça um novo link.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <ExpiredLinkReset {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await fillPasswords(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'O link de redefinição expirou. Peça um novo link.',
    )
  },
}
