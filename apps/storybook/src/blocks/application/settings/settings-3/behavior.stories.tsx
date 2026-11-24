import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Settings3,
  type Settings3Props,
} from '@tc96/blocks/application/settings/settings-3'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings3Data } from '../fixtures/settings-3.ts'
import {
  type Settings3Controls,
  settings3ControlArgs,
} from './settings-3-controls.ts'
import { ComposedSettings3 } from './settings-3-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: { ...settings3ControlArgs, onValueChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings3/Behavior',
} satisfies Meta<
  Settings3Controls & { onValueChange: Settings3Props['onValueChange'] }
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
    ).toHaveTextContent(settings3Data.options.fontSize[1].label)
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
    <Settings3
      labels={{
        emailNotifications: 'Avisos por e-mail',
        fontSize: 'Fonte',
        language: 'Língua',
        title: 'Preferências',
      }}
      onValueChange={args.onValueChange}
      options={settings3Data.options}
      values={settings3Data.values}
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
  render: (args) => <ComposedSettings3 {...args} pending />,
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
    <ComposedSettings3 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings3 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings3 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando configurações'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
