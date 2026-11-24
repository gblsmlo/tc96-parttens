import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings2 } from '@tc96/blocks/application/settings/settings-2'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings2Options, settings2Values } from '../fixtures/settings-2.ts'
import {
  type Settings2Controls,
  settings2ControlArgs,
} from './settings-2-controls.ts'
import { ComposedSettings2 } from './settings-2-layouts.tsx'

type Settings2Spies = {
  onValueChange: (key: string, value: string | boolean) => void
}

const retryHandler = fn()

const meta = {
  args: { ...settings2ControlArgs, onValueChange: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings2/Behavior',
} satisfies Meta<Settings2Controls & Settings2Spies>

export default meta

type Story = StoryObj<typeof meta>

export const ThemeSelectCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Tema da interface',
      }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Escuro' }))
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenCalledWith('theme', 'dark'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const FontSizeSelectCallsOnValueChange: Story = {
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

export const DisplayNamesSelectCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Nomes de exibição',
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Apelido' }),
    )
    await waitFor(() =>
      expect(args.onValueChange).toHaveBeenCalledWith(
        'displayNames',
        'nickname',
      ),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const UnderlineSwitchCallsOnValueChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('switch', { name: 'Sublinhar links' }),
    )
    await expect(args.onValueChange).toHaveBeenCalledWith(
      'underlineLinks',
      true,
    )
  },
}

export const SwitchShowsUnderlineValue: Story = {
  args: { underlineLinks: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', { name: 'Sublinhar links' }),
    ).toBeChecked()
  },
}

export const SelectShowsCurrentLabel: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Tema da interface',
      }),
    ).toHaveTextContent('Claro')
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings2
      labels={{
        generalTitle: 'Preferências',
        theme: 'Aparência',
      }}
      onValueChange={args.onValueChange}
      options={settings2Options}
      values={settings2Values}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Preferências')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Aparência' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Geral', { exact: true })).toBeNull()
    await expect(canvas.queryByText('Tema da interface')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings2 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando preferências'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings2 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings2 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings2 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando preferências'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
