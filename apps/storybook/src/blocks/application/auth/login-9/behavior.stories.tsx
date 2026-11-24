import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Login9,
  type Login9Props,
} from '@tc96/ui/blocks/application/auth/login-9'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authLogo, authProviders } from '../fixtures/auth-data'
import {
  login9Brands,
  login9BrandsLabel,
  login9Testimonial,
} from './login-9-layouts.tsx'
import { email, emailField, submitButton } from './login-9-play.ts'

const meta = {
  args: {
    logo: authLogo,
    brands: login9Brands,
    brandsLabel: login9BrandsLabel,
    onProviderSelect: fn(),
    onSubmit: fn(),
    providers: authProviders,
    testimonial: login9Testimonial,
  },
  component: Login9,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Login/Login9/Behavior',
} satisfies Meta<typeof Login9>

export default meta

type Story = StoryObj<typeof meta>

function FailingLogin9(props: Readonly<Login9Props>) {
  const [error, setError] = useState<string>()
  return (
    <Login9
      {...props}
      error={error}
      onSubmit={(values) => {
        props.onSubmit(values)
        setError('Não foi possível enviar o link.')
      }}
    />
  )
}

function RejectedLogin9(props: Readonly<Login9Props>) {
  const [fieldErrors, setFieldErrors] = useState<Login9Props['fieldErrors']>()
  return (
    <Login9
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
  render: (args) => <RejectedLogin9 {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(emailField(canvas), email)
    await userEvent.click(submitButton(canvas))
    await waitFor(() => expect(emailField(canvas)).toHaveFocus())
    await expect(emailField(canvas)).toHaveAttribute('aria-invalid', 'true')
  },
}

export const ErrorFocusesAlert: Story = {
  render: (args) => <FailingLogin9 {...args} />,
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

export const AsideShowsTestimonial: Story = {
  play: async ({ canvasElement }) => {
    const aside = within(canvasElement).getByRole('complementary', {
      name: 'Depoimento de cliente',
    })
    const canvas = within(aside)
    await expect(
      canvas.getByRole('img', { name: 'Avaliação: 5 de 5 estrelas' }),
    ).toBeVisible()
    await expect(canvas.getByText(login9Testimonial.quote)).toBeVisible()
    await expect(canvas.getByText('Ana Souza')).toBeVisible()
    await expect(canvas.getByText(login9BrandsLabel)).toBeVisible()
  },
}

export const NoStarsWithoutRating: Story = {
  args: { testimonial: { ...login9Testimonial, rating: undefined } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('img', { name: /Avaliação/ }),
    ).toBeNull()
  },
}

export const NoAsideWithoutContent: Story = {
  args: { brands: undefined, brandsLabel: undefined, testimonial: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('complementary')).toBeNull()
  },
}
