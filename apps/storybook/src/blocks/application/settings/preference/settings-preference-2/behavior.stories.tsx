import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  SettingsPreference2,
  type SettingsPreference2Props,
} from '@tc96/ui/blocks/application/settings/preference/settings-preference-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settingsPreference2Data } from '../../fixtures/settings-preference-2.ts'
import {
  type SettingsPreference2Controls,
  settingsPreference2ControlArgs,
} from './settings-preference-2-controls.ts'
import { ComposedSettingsPreference2 } from './settings-preference-2-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settingsPreference2ControlArgs, onValueChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettingsPreference2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Preference/Settings2/Behavior',
} satisfies Meta<
  SettingsPreference2Controls & {
    onValueChange: SettingsPreference2Props['onValueChange']
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const FontSizeCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Tamanho da fonte',
      }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Grande' }))
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenCalledWith('fontSize', 'large'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const LanguageCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Idioma' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Inglês' }))
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenCalledWith('language', 'en-US'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const SwitchCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', {
        name: 'Notificações por e-mail',
      }),
    )
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'emailNotifications',
      false,
    )
  },
}

export const RowsShowTheirValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Tamanho da fonte' }),
    ).toHaveTextContent(settingsPreference2Data.options.fontSize[1].label)
    await expect(
      canvas.getByRole('combobox', { name: 'Idioma' }),
    ).toHaveTextContent('Português (Brasil)')
    await expect(
      canvas.getByRole('switch', { name: 'Notificações por e-mail' }),
    ).toBeChecked()
  },
}

export const WithoutValueChangeKeepsValues: Story = {
  args: { withValueChange: false },
  play: async ({ args, canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', {
      name: 'Notificações por e-mail',
    })
    await userEvent.click(sw)
    await expect(sw).toBeChecked()
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <SettingsPreference2
      labels={{
        emailNotifications: 'Avisos por e-mail',
        fontSize: 'Fonte',
        language: 'Língua',
        title: 'Preferências',
      }}
      onValueChange={args.onValueChange}
      options={settingsPreference2Data.options}
      values={settingsPreference2Data.values}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preferências')).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: 'Fonte' })).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: 'Língua' })).toBeVisible()
    await expect(
      canvas.getByRole('switch', { name: 'Avisos por e-mail' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Interface e tema')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettingsPreference2 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando configurações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettingsPreference2 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettingsPreference2 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettingsPreference2 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando configurações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
