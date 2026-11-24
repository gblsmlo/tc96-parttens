import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Login10,
  type Login10Props,
} from '@tc96/blocks/application/auth/login-10'
import { useState } from 'react'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { authLogo } from '../fixtures/auth-data'
import { login10FooterLinks, login10Testimonials } from './login-10-layouts.tsx'

const meta = {
  args: { onSubmit: fn() },
  component: Login10,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login10/Behavior',
} satisfies Meta<typeof Login10>

export default meta

type Story = StoryObj<typeof meta>

const email = 'ana@acme.com'
const password = 'segredo123'

type Canvas = ReturnType<typeof within>

const emailField = (canvas: Canvas) =>
  canvas.getByRole('textbox', { name: 'E-mail' })

const passwordField = (canvas: Canvas) => canvas.getByLabelText('Senha')

const submitButton = (canvas: Canvas) =>
  canvas.getByRole('button', { name: 'Entrar' })

async function fillCredentials(canvas: Canvas) {
  await userEvent.type(emailField(canvas), email)
  await userEvent.type(passwordField(canvas), password)
}

function FailingLogin10(props: Readonly<Login10Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login10
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('E-mail ou senha incorretos.')
      }}
    />
  )
}

function RejectedLogin10(props: Readonly<Login10Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login10Props['fieldErrors']>()
  return (
    <Login10
      {...props}
      fieldErrors={fieldErrors}
      onSubmit={(values) => {
        props.onSubmit(values)
        setFieldErrors({
          email: 'Este e-mail não está cadastrado.',
          password: 'A senha está incorreta.',
        })
      }}
    />
  )
}

export const PageHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Bem-vindo de volta' }),
    ).toBeVisible()
  },
}

export const AsideOutsideMainFromLg: Story = {
  args: { logo: authLogo, testimonials: login10Testimonials },
  play: async ({ canvasElement }) => {
    const aside = canvasElement.querySelector('aside')
    await expect(aside).toHaveAttribute('aria-label', 'Sobre o produto')
    await expect(aside?.className).toContain('hidden')
    await expect(aside?.className).toContain('lg:flex')
    await expect(canvasElement.querySelector('main')).not.toContainElement(
      aside,
    )
    await expect(canvasElement.querySelector('[data-slot="card"]')).toBeNull()
  },
}

export const DotsSwitchTestimonial: Story = {
  args: { testimonials: login10Testimonials },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dots = canvas.getAllByRole('button', {
      hidden: true,
      name: /^Mostrar depoimento de/,
    })
    await expect(dots).toHaveLength(3)
    await expect(dots[0]).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(
      canvas.getByRole('button', {
        hidden: true,
        name: 'Mostrar depoimento de Bruno Lima',
      }),
    )
    await expect(dots[1]).toHaveAttribute('aria-pressed', 'true')
    await expect(dots[0]).toHaveAttribute('aria-pressed', 'false')
    const active = canvasElement.querySelectorAll('figure[data-active]')
    await expect(active).toHaveLength(1)
    await expect(active[0]).toHaveTextContent('Bruno Lima')
    await expect(active[0]).not.toHaveAttribute('aria-hidden')
    await expect(
      canvasElement.querySelectorAll('figure[aria-hidden="true"]'),
    ).toHaveLength(2)
  },
}

export const SingleTestimonialHasNoDots: Story = {
  args: { testimonials: login10Testimonials.slice(0, 1) },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryAllByRole('button', {
        hidden: true,
        name: /^Mostrar depoimento de/,
      }),
    ).toHaveLength(0)
  },
}

export const LabelsOverrideDefaults: Story = {
  args: { labels: { submit: 'Acessar', title: 'Acessar a conta' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Acessar a conta' }),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Acessar' })).toBeVisible()
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({ email, password })
  },
}

export const PendingBlocksActions: Story = {
  args: {
    onProviderSelect: fn(),
    pending: true,
    providers: [{ id: 'google', label: 'Google' }],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /^Entrar/ })
    await expect(submit).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    ).toBeDisabled()
    await userEvent.type(emailField(canvas), email)
    await userEvent.type(passwordField(canvas), `${password}{Enter}`)
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

export const FieldErrorsFocusFirstInvalid: Story = {
  render: (args) => <RejectedLogin10 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAccessibleDescription(
      'Este e-mail não está cadastrado.',
    )
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingLogin10 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await fillCredentials(canvas)
    await userEvent.click(submitButton(canvas))
    const alert = await canvas.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
  },
}

export const ProvidersBelowForm: Story = {
  args: {
    onProviderSelect: fn(),
    providers: [
      { id: 'google', label: 'Google' },
      { id: 'github', label: 'GitHub' },
      { id: 'microsoft', label: 'Microsoft' },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const google = canvas.getByRole('button', { name: 'Continuar com Google' })
    const form = canvasElement.querySelector('form')
    await expect(form?.compareDocumentPosition(google) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    await userEvent.click(google)
    await expect(args.onProviderSelect).toHaveBeenCalledWith('google')
  },
}

export const LinksRenderWithHref: Story = {
  args: {
    copyright: '© 2026 Acme',
    footerLinks: login10FooterLinks,
    forgotPasswordHref: '/forgot',
    signupHref: '/signup',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'Esqueceu a senha?' }),
    ).toHaveAttribute('href', '/forgot')
    await expect(
      canvas.getByRole('link', { name: 'Criar conta' }),
    ).toHaveAttribute('href', '/signup')
    const footer = within(canvas.getByRole('contentinfo'))
    await expect(
      footer.getByRole('navigation', { name: 'Links do rodapé' }),
    ).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Termos' })).toHaveAttribute(
      'href',
      '/terms',
    )
    await expect(footer.getByText('© 2026 Acme')).toBeVisible()
  },
}

export const LinksOnlyWithHref: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link')).toBeNull()
    await expect(canvas.queryByRole('contentinfo')).toBeNull()
  },
}
