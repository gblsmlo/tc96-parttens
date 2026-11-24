import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Signup2,
  type Signup2Props,
} from '@tc96/ui/blocks/application/auth/signup-2'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  confirmField,
  email,
  emailField,
  fillAccount,
  fillIdentity,
  name,
  nameField,
  password,
  passwordField,
  submitButton,
} from './signup-2-play.ts'

const meta = {
  args: { onSubmit: fn() },
  component: Signup2,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register2/Behavior',
} satisfies Meta<typeof Signup2>

export default meta

type Story = StoryObj<typeof meta>

function FailingSignup2(props: Readonly<Signup2Props>) {
  const [error, setError] = useState<string>()
  return (
    <Signup2
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível criar a conta. Tente novamente.')
      }}
    />
  )
}

function RejectedSignup2(props: Readonly<Signup2Props>) {
  const [fieldErrors, setFieldErrors] = useState<Signup2Props['fieldErrors']>()
  return (
    <Signup2
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({
          email: 'Este e-mail já está em uso.',
          password: 'Escolha uma senha mais forte.',
        })
      }}
    />
  )
}

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Criar conta' }),
    ).toBeVisible()
  },
}

export const FieldsAutocomplete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(nameField(canvas)).toHaveAttribute('autocomplete', 'name')
    await expect(emailField(canvas)).toHaveAttribute('autocomplete', 'email')
    await expect(emailField(canvas)).toHaveAttribute('type', 'email')
    await expect(passwordField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    await expect(passwordField(canvas)).toHaveAttribute('minlength', '8')
    await expect(confirmField(canvas)).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { submit: 'Cadastrar', title: 'Abrir conta' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Abrir conta' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Cadastrar' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Criar conta' }),
    ).toBeNull()
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password,
    })
  },
}

export const EnterSubmits: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email,
      name,
      password,
    })
  },
}

export const PendingBlocksActions: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Criar conta/ })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('data-loading')
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const NativeConstraintsBlockSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(nameField(canvas)).toHaveFocus())
    await expect(nameField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="field-error"]'),
      ).toBeVisible(),
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await userEvent.type(nameField(canvas), name)
    await userEvent.type(emailField(canvas), 'ana')
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), password)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorsMarkFields: Story = {
  args: {
    fieldErrors: {
      email: 'Este e-mail já está em uso.',
      name: 'Informe o nome completo.',
      password: 'Escolha uma senha mais forte.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(nameField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Informe o nome completo.')).toBeVisible()
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByText('Este e-mail já está em uso.')).toBeVisible()
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(
      canvas.getByText('Escolha uma senha mais forte.'),
    ).toBeVisible()
  },
}

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedSignup2 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail já está em uso.',
    )
    await expect(passwordField(canvas)).toHaveAttribute('aria-invalid', 'true')
    await expect(nameField(canvas)).not.toHaveAttribute('aria-invalid', 'true')
  },
}

export const ErrorShowsAlert: Story = {
  args: { error: 'Não foi possível criar a conta. Tente novamente.' },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível criar a conta. Tente novamente.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingSignup2 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
    await expect(alert).toHaveTextContent(
      'Não foi possível criar a conta. Tente novamente.',
    )
  },
}

export const OnlyEssentialParts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('checkbox')).toBeNull()
    await expect(
      canvas.queryByRole('group', { name: 'Entrar com outro serviço' }),
    ).toBeNull()
    await expect(canvas.queryByRole('separator')).toBeNull()
  },
}
