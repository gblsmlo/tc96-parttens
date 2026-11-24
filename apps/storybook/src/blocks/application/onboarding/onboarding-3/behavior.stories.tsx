import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { StatefulOnboarding3 } from '../fixtures/onboarding-3.tsx'

const meta = {
  args: {
    onComplete: fn(),
    onContinue: fn(),
    onFinish: fn(),
    onOpenChange: fn(),
    onStepChange: fn(),
  },
  component: StatefulOnboarding3,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Onboarding/Onboarding3/Behavior',
} satisfies Meta<typeof StatefulOnboarding3>

export default meta

type Story = StoryObj<typeof meta>

const next = () => screen.getByRole('button', { name: /Continuar/ })

export const ShowsCurrentStepAndCounter: Story = {
  play: async () => {
    await expect(
      screen.getByRole('heading', { name: 'Seu perfil' }),
    ).toBeVisible()
    await expect(screen.getByText('Passo 1 de 3')).toBeVisible()
    await expect(
      screen.getByText('Nome, cargo e foto do seu perfil.'),
    ).toBeVisible()
  },
}

export const ContinueMovesToNextStepAndCallsOnStepChange: Story = {
  play: async ({ args }) => {
    await userEvent.click(next())
    await expect(args.onStepChange).toHaveBeenCalledWith('workspace')
    await expect(
      screen.getByRole('heading', { name: 'Seu espaço de trabalho' }),
    ).toBeVisible()
    await expect(screen.getByText('Passo 2 de 3')).toBeVisible()
  },
}

export const OnContinueReceivesTheCurrentStepId: Story = {
  play: async ({ args }) => {
    await userEvent.click(next())
    await expect(args.onContinue).toHaveBeenCalledWith('profile')
  },
}

export const OnContinueFalseKeepsTheStep: Story = {
  args: { onContinue: fn(() => false) },
  play: async ({ args }) => {
    await userEvent.click(next())
    await expect(args.onStepChange).not.toHaveBeenCalled()
    await expect(
      screen.getByRole('heading', { name: 'Seu perfil' }),
    ).toBeVisible()
  },
}

export const BackReturnsToThePreviousStep: Story = {
  args: { initialStep: 'workspace' },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    await expect(args.onStepChange).toHaveBeenCalledWith('profile')
    await expect(
      screen.getByRole('heading', { name: 'Seu perfil' }),
    ).toBeVisible()
  },
}

export const BackIsDisabledOnTheFirstStep: Story = {
  play: async () => {
    await expect(screen.getByRole('button', { name: 'Voltar' })).toBeDisabled()
  },
}

export const LastStepFinishesInsteadOfContinuing: Story = {
  args: { initialStep: 'invite' },
  play: async ({ args }) => {
    await expect(screen.queryByRole('button', { name: /Continuar/ })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Concluir' }))
    await expect(args.onComplete).toHaveBeenCalledTimes(1)
    await expect(args.onStepChange).not.toHaveBeenCalled()
  },
}

export const PendingDisablesContinue: Story = {
  args: { pending: true },
  play: async ({ args }) => {
    await expect(next()).toBeDisabled()
    await expect(args.onStepChange).not.toHaveBeenCalled()
  },
}

export const ErrorShowsAnAlertAboveTheActions: Story = {
  args: { error: 'Não foi possível salvar o seu perfil.' },
  play: async () => {
    const alert = screen.getByRole('alert')
    await expect(alert).toHaveTextContent('Não foi possível continuar')
    await expect(alert).toHaveTextContent(
      'Não foi possível salvar o seu perfil.',
    )
    await expect(
      alert.compareDocumentPosition(next()) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  },
}

export const NoErrorRendersNoAlert: Story = {
  play: async () => {
    await expect(screen.queryByRole('alert')).toBeNull()
  },
}

export const SkipRendersOnlyWithOnSkip: Story = {
  play: async () => {
    await expect(screen.queryByRole('button', { name: 'Pular' })).toBeNull()
  },
}

export const SkipCallsOnSkipWithTheStepId: Story = {
  args: { onSkip: fn() },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Pular' }))
    await expect(args.onSkip).toHaveBeenCalledWith('profile')
  },
}

export const CompletedShowsSuccessAndStartCallsOnFinish: Story = {
  args: { completed: true },
  play: async ({ args }) => {
    await expect(
      screen.getByRole('heading', { name: 'Tudo pronto' }),
    ).toBeVisible()
    await expect(screen.queryByRole('button', { name: /Continuar/ })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
    await expect(args.onFinish).toHaveBeenCalledTimes(1)
  },
}

export const LabelsOverrideTexts: Story = {
  args: {
    labels: {
      back: 'Anterior',
      next: 'Avançar',
      stepOf: (current, total) => `Etapa ${current}/${total}`,
    },
  },
  play: async () => {
    await expect(screen.getByText('Etapa 1/3')).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Avançar' })).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Anterior' })).toBeVisible()
  },
}

export const DotStepperMarksTheCurrentStep: Story = {
  args: { initialStep: 'workspace' },
  play: async () => {
    const dots = within(
      screen.getByRole('list', { name: 'Etapas da configuração' }),
    ).getAllByRole('listitem')
    await expect(dots).toHaveLength(3)
    await expect(dots[0]).toHaveAttribute('data-status', 'complete')
    await expect(dots[1]).toHaveAttribute('aria-current', 'step')
    await expect(dots[2]).toHaveAttribute('data-status', 'upcoming')
  },
}

export const ClosedRendersNothing: Story = {
  args: { open: false },
  play: async () => {
    await expect(screen.queryByRole('dialog')).toBeNull()
  },
}

export const DialogIsNamedByTheStepTitle: Story = {
  play: async () => {
    await expect(
      screen.getByRole('dialog', { name: 'Seu perfil' }),
    ).toBeVisible()
  },
}

export const CloseButtonCallsOnOpenChange: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}
