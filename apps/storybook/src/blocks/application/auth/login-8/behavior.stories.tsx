import type { Meta, StoryObj } from '@storybook/react-vite'
import { Login8, type Login8Props } from '@tc96/blocks/application/auth/login-8'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { login8Media } from './login-8-layouts.tsx'
import { email, emailField, submitButton } from './login-8-play.ts'

const meta = {
  args: {
    logo: authLogo,
    media: login8Media,
    onProviderSelect: fn(),
    onSubmit: fn(),
    providers: authProviders,
  },
  component: Login8,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login8/Behavior',
} satisfies Meta<typeof Login8>

export default meta

type Story = StoryObj<typeof meta>

function FailingLogin8(props: Readonly<Login8Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login8
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível enviar o link.')
      }}
    />
  )
}

function RejectedLogin8(props: Readonly<Login8Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login8Props['fieldErrors']>()
  return (
    <Login8
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ email: 'Este e-mail não está cadastrado.' })
      }}
    />
  )
}

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Entrar na sua conta' }),
    ).toBeVisible()
  },
}

export const EmailHintDescribesField: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Seu link de acesso vale por 15 minutos.',
    )
  },
}

export const SubmitSendsEmail: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email })
  },
}

export const PendingBlocksActions: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /Enviar link de acesso/ })
    await expect(submit).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await userEvent.type(emailField(canvas), `${email}{Enter}`)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const NativeConstraintsBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorFocusesEmail: Story = {
  render: (args) => <RejectedLogin8 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingLogin8 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
  },
}

export const ProviderCallsBack: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Continuar com GitHub',
      }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledWith('github')
  },
}

export const NoProvidersWithoutList: Story = {
  args: { providers: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('group')).toBeNull()
    await expect(canvas.queryByText('ou continue com')).toBeNull()
  },
}
