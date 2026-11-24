import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Signup3,
  type Signup3Props,
} from '@tc96/blocks/application/auth/signup-3'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
import { signup3Brands } from './signup-3-layouts.tsx'

const meta = {
  args: { onSubmit: fn() },
  component: Signup3,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register3/Behavior',
} satisfies Meta<typeof Signup3>

export default meta

type Story = StoryObj<typeof meta>

const email = 'ana@acme.com'
const password = 'Segredo123!'

type Canvas = ReturnType<typeof within>

const emailField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'E-mail de trabalho' })

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Começar teste grátis' })

async function fillAccount(canvas: Canvas) {
  await userEvent.type(emailField(canvas), email)
  await userEvent.type(passwordField(canvas), password)
}

function FailingSignup3(props: Readonly<Signup3Props>) {
  const [error, setError] = useState<string>()
  return (
    <Signup3
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível criar a conta. Tente novamente.')
      }}
    />
  )
}

function RejectedSignup3(props: Readonly<Signup3Props>) {
  const [fieldErrors, setFieldErrors] = useState<Signup3Props['fieldErrors']>()
  return (
    <Signup3
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({ email: 'Este e-mail já tem uma conta.' })
      }}
    />
  )
}

export const PageHeadings: Story = {
  args: { badge: 'Novo', logo: authLogo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(canvas.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(
      canvas.getByRole('heading', {
        level: 2,
        name: 'Comece seu teste de 14 dias',
      }),
    ).toBeVisible()
    await expect(canvas.getByText('Novo')).toBeVisible()
  },
}

export const LogoOutsideCard: Story = {
  args: { loginHref: '/login', logo: authLogo },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const banner = canvas.getByRole('banner')
    await expect(banner).toHaveTextContent('Acme')
    await expect(
      canvasElement.querySelector('[data-slot="card"]'),
    ).not.toContainElement(banner)
    await expect(
      within(banner).getByRole('link', { name: 'Entrar' }),
    ).toHaveAttribute('href', '/login')
  },
}

export const HeadingAcceptsNodes: Story = {
  args: {
    labels: {
      heading: (
        <>
          Venda <mark>mais</mark>
        </>
      ),
    },
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole('heading', { level: 1 })
    await expect(heading).toHaveTextContent('Venda mais')
    await expect(heading.querySelector('mark')).toHaveTextContent('mais')
  },
}

export const ProvidersStackedAboveForm: Story = {
  args: { onProviderSelect: fn(), providers: authProviders },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const google = canvas.getByRole('button', { name: 'Continuar com Google' })
    const form = canvasElement.querySelector('form')
    await expect(form?.compareDocumentPosition(google) ?? 0).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    )
    await userEvent.click(google)
    await expect(args.onProviderSelect).toHaveBeenCalledWith('google')
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email, password })
  },
}

export const PasswordHintAndToggle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(passwordField(canvas)).toHaveAttribute(
      'placeholder',
      'Mínimo de 8 caracteres',
    )
    await userEvent.type(passwordField(canvas), password)
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'text')
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar senha' }))
    await expect(passwordField(canvas)).toHaveAttribute('type', 'password')
  },
}

export const PendingBlocksActions: Story = {
  args: { onProviderSelect: fn(), pending: true, providers: authProviders },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: /^Começar teste grátis/ }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await expect(
      canvasElement.querySelector('[data-slot="form"]'),
    ).toHaveAttribute('aria-busy', 'true')
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedSignup3 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail já tem uma conta.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingSignup3 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillAccount(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
  },
}

export const TermsLinksOnlyWithHref: Story = {
  args: { privacyHref: '/privacy', termsHref: '/terms' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await expect(
      canvas.getByRole('link', { name: 'Política de Privacidade' }),
    ).toHaveAttribute('href', '/privacy')
  },
}

export const NoLinksWithoutHref: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('banner')).toBeNull()
  },
}

export const BrandsRow: Story = {
  args: {
    brands: signup3Brands,
    brandsLabel: 'Times que já vendem mais com a Acme',
  },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Times que já vendem mais com a Acme',
    })
    await expect(region).toHaveTextContent('Nimbus')
  },
}
