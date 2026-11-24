import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings17 } from '@tc96/blocks/application/settings/settings-17'
import { expect, fn, userEvent, within } from 'storybook/test'
import { privacyControls } from '../fixtures/settings-17.ts'
import {
  type Settings17Controls,
  settings17ControlArgs,
} from './settings-17-controls.ts'
import { ComposedSettings17 } from './settings-17-layouts.tsx'

const meta = {
  args: {
    ...settings17ControlArgs,
    onAction: fn(),
    onCheckedChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings17 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings17/Behavior',
} satisfies Meta<
  Settings17Controls & {
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
    <Settings17
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
