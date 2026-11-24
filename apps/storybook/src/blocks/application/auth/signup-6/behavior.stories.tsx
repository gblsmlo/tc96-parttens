import type { Meta, StoryObj } from '@storybook/react-vite'
import { Signup6 } from '@tc96/ui/blocks/application/auth/signup-6'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { authProviders } from '../fixtures/auth-data'
import { gradientMedia } from '../login-6/login-6-layouts.tsx'

const meta = {
  args: { onSubmit: fn() },
  component: Signup6,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Auth/Register/Register6/Behavior',
} satisfies Meta<typeof Signup6>

export default meta

type Story = StoryObj<typeof meta>

type Canvas = ReturnType<typeof within>

async function fillForm(canvas: Canvas, confirm: string) {
  await userEvent.type(canvas.getByRole('textbox', { name: 'Nome' }), 'Ana')
  await userEvent.type(
    canvas.getByRole('textbox', { name: 'E-mail' }),
    'ana@acme.com',
  )
  await userEvent.type(canvas.getByLabelText('Senha'), 'Segredo#123')
  await userEvent.type(canvas.getByLabelText('Confirmar senha'), confirm)
}

export const PageHeading: Story = {
  args: { media: gradientMedia },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('main')).toHaveLength(1)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Criar conta' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('complementary', { name: 'Apresentação do produto' }),
    ).not.toBeNull()
  },
}

export const SubmitSendsValues: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillForm(canvas, 'Segredo#123')
    await userEvent.click(canvas.getByRole('button', { name: 'Criar conta' }))
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce())
    await expect(args.onSubmit).toHaveBeenCalledWith({
      email: 'ana@acme.com',
      name: 'Ana',
      password: 'Segredo#123',
    })
  },
}

export const MismatchBlocksSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await fillForm(canvas, 'Outra#123')
    await userEvent.click(canvas.getByRole('button', { name: 'Criar conta' }))
    await waitFor(() =>
      expect(canvas.getByLabelText('Confirmar senha')).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    )
    await expect(args.onSubmit).not.toHaveBeenCalled()
  },
}

export const ProvidersAndLinks: Story = {
  args: {
    loginHref: '/login',
    onProviderSelect: fn(),
    privacyHref: '/privacy',
    providers: authProviders,
    termsHref: '/terms',
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvasElement.querySelector('form')
    const group = canvas.getByRole('group', {
      name: 'Entrar com outro serviço',
    })
    await expect(form?.compareDocumentPosition(group) ?? 0).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    await expect(canvas.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/login',
    )
    await expect(
      canvas.getByRole('link', { name: 'Termos de Uso' }),
    ).toHaveAttribute('href', '/terms')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Continuar com Google' }),
    )
    await expect(args.onProviderSelect).toHaveBeenCalledWith('google')
  },
}

export const HiddenProviders: Story = {
  args: { providers: authProviders, showProviders: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('group', { name: 'Entrar com outro serviço' }),
    ).toBeNull()
    await expect(canvas.queryByText('ou continue com')).toBeNull()
  },
}
