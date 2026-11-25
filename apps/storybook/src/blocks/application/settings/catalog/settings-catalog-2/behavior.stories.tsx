import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsCatalog2 } from '@tc96/ui/blocks/application/settings/catalog/settings-catalog-2'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  type SettingsCatalog2Controls,
  settingsCatalog2ControlArgs,
} from './settings-catalog-2-controls.ts'
import { ComposedSettingsCatalog2 } from './settings-catalog-2-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settingsCatalog2ControlArgs, onEnabledChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsCatalog2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Catalog/Settings2/Behavior',
} satisfies Meta<
  SettingsCatalog2Controls & { onEnabledChange: (enabled: boolean) => void }
>

export default meta

type Story = StoryObj<typeof meta>

export const SwitchCallsOnEnabledChange: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', {
      name: 'Ativar SLAs',
    })
    await userEvent.click(toggle)
    await expect(args.onEnabledChange).toHaveBeenLastCalledWith(
      true,
      expect.anything(),
    )
    await expect(toggle).not.toBeChecked()
  },
}

export const EnabledIsChecked: Story = {
  args: { enabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', { name: 'Ativar SLAs' }),
    ).toBeChecked()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsCatalog2
      labels={{
        description: 'Aplique prazos às issues',
        enable: 'Ligar SLAs',
        title: 'Prazos',
      }}
      onEnabledChange={args.onEnabledChange}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Prazos')).toBeVisible()
    await expect(canvas.getByText('Aplique prazos às issues')).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Ligar SLAs' }),
    ).toBeVisible()
    await expect(canvas.queryByText('SLAs')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsCatalog2 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando SLAs'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsCatalog2 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsCatalog2 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsCatalog2 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando SLAs')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
