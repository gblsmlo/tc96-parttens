import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsSecurity1 } from '@tc96/ui/blocks/application/settings/security/settings-security-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { privacyControls } from '../../fixtures/settings-security-1.ts'
import {
  type SettingsSecurity1Controls,
  settingsSecurity1ControlArgs,
} from './settings-security-1-controls.ts'
import { ComposedSettingsSecurity1 } from './settings-security-1-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settingsSecurity1ControlArgs,
    onAction: fn(),
    onCheckedChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsSecurity1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Security/Settings1/Behavior',
} satisfies Meta<
  SettingsSecurity1Controls & {
    onAction: (controlId: string) => void
    onCheckedChange: (controlId: string, checked: boolean) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchCallsOnCheckedChange: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('switch', { name: 'Acesso do suporte' })
    await expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      'support-access',
      true,
    )
    await expect(toggle).toBeChecked()
  },
}

export const SwitchShowsCheckedValue: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('switch', { name: 'Análise de uso' }),
    ).toBeChecked()
    await expect(
      canvas.getByRole('switch', { name: 'Busca com dados ocultos' }),
    ).not.toBeChecked()
  },
}

export const PlanBadgesMarkProAndBeta: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Pro')).toBeVisible()
    await expect(canvas.getByText('Beta')).toBeVisible()
    await expect(canvas.getAllByText(/^(Pro|Beta)$/)).toHaveLength(2)
  },
}

export const ActionRowRendersButtonInPlaceOfSwitch: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('switch', { name: 'Exportar meus dados' }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Exportar dados' }),
    )
    await expect(args.onAction).toHaveBeenCalledWith('export-data')
  },
}

export const ActionButtonNeedsOnAction: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Exportar dados' }),
    ).toBeNull()
    await expect(canvas.getAllByRole('switch')).toHaveLength(4)
  },
}

export const LabelsOverrideTexts: Story = {
  render: () => (
    <SettingsSecurity1
      controls={privacyControls}
      labels={{ beta: 'Prévia', pro: 'Plano Pro', title: 'Dados pessoais' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Dados pessoais')).toBeVisible()
    await expect(canvas.getByText('Plano Pro')).toBeVisible()
    await expect(canvas.getByText('Prévia')).toBeVisible()
    await expect(canvas.queryByText('Privacidade')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsSecurity1 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando privacidade'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsSecurity1 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettingsSecurity1 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsSecurity1 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando privacidade'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
