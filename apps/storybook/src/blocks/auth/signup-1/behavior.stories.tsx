import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup1, type SignupProps } from '@tc96/blocks/auth/signup-1'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
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
} from './signup-1-play.ts'

const meta = {
  args: {
    loginHref: '/login',
    logo: authLogo,
    onProviderSelect: fn(),
    onSubmit: fn(),
    privacyHref: '/privacy',
    providers: authProviders,
    termsHref: '/terms',
  },
  component: Signup1,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Auth/Signup1/Behavior',
} satisfies Meta<typeof Signup1>

export default meta

type Story = StoryObj<typeof meta>

function FailingSignup(props: Readonly<SignupProps>) {
  const [error, setError] = useState<string>()
  return (
    <Signup1
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível criar a conta. Tente novamente.')
      }}
    />
  )
}

function RejectedSignup(props: Readonly<SignupProps>) {
  const [fieldErrors, setFieldErrors] = useState<SignupProps['fieldErrors']>()
  return (
    <Signup1
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
    const submit = canvas.getByRole('button', { name: 'Criando conta…' })
    await expect(submit).toBeDisabled()
    await expect(submit).toHaveAttribute('type', 'submit')
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await fillIdentity(canvas)
    await userEvent.type(passwordField(canvas), password)
    await userEvent.type(confirmField(canvas), `${password}{Enter}`)
    await userEvent.click(submit, { pointerEventsCheck: 0 })
    await expect(args.onSubmit).not.toHaveBeenCalled()
    await expect(args.onProviderSelect).not.toHaveBeenCalled()
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
  render: (args) => <RejectedSignup {...args} />,
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
  render: (args) => <FailingSignup {...args} />,
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

export const LinksThroughRenderLink: Story = {
  args: { renderLink: fn(renderAnchor) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
    await expect(canvas.getByText('Já tem uma conta?')).toBeVisible()
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await expect(
      canvas.getByRole('link', { name: 'Política de Privacidade' }),
    ).toHaveAttribute('href', '/privacy')
    await expect(
      canvas.getByText('Ao criar a conta você concorda com os'),
    ).toBeVisible()
    await expect(canvas.getByText('e a')).toBeVisible()
    await expect(args.renderLink).toHaveBeenCalledWith('/login')
    await expect(args.renderLink).toHaveBeenCalledWith('/terms')
    await expect(args.renderLink).toHaveBeenCalledWith('/privacy')
    await expect(canvas.queryByRole('checkbox')).toBeNull()
  },
}

export const TermsOnlyWithHref: Story = {
  args: {
    loginHref: undefined,
    privacyHref: undefined,
    renderLink: fn(renderAnchor),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await expect(canvas.queryByText('Política de Privacidade')).toBeNull()
    await expect(canvas.queryByText('e a')).toBeNull()
    await expect(canvas.queryByText('Já tem uma conta?')).toBeNull()
    await expect(args.renderLink).toHaveBeenCalledWith('/terms')
    await expect(args.renderLink).not.toHaveBeenCalledWith('/privacy')
  },
}

export const LinksOnlyWithHref: Story = {
  args: {
    loginHref: undefined,
    privacyHref: undefined,
    renderLink: fn(renderAnchor),
    termsHref: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByText('Já tem uma conta?')).toBeNull()
    await expect(
      canvas.queryByText('Ao criar a conta você concorda com os'),
    ).toBeNull()
    await expect(args.renderLink).not.toHaveBeenCalled()
  },
}

export const ProviderSelected: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Entrar com outro serviço' }),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continuar com GitHub' }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledOnce()
    await expect(args.onProviderSelect).toHaveBeenCalledWith('github')
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const PageFrame: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    const logo = canvas.getByText('Acme')
    const card = canvasElement.querySelector('[data-slot="card"]')
    await expect(card).not.toBeNull()
    await expect(card?.contains(logo)).toBe(false)
    await expect(
      logo.compareDocumentPosition(card as Element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(canvas.getByRole('main')).toContainElement(logo)
  },
}
