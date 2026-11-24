import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Settings4,
  type Settings4Props,
} from '@tc96/ui/blocks/application/settings/settings-4'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { settings4Data } from '../fixtures/settings-4.ts'
import {
  type Settings4Controls,
  settings4ControlArgs,
} from './settings-4-controls.ts'
import { ComposedSettings4 } from './settings-4-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings4ControlArgs,
    onColorThemeChange: fn(),
    onModeChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings4/Behavior',
} satisfies Meta<
  Settings4Controls & {
    onColorThemeChange: Settings4Props['onColorThemeChange']
    onModeChange: Settings4Props['onModeChange']
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const ModeCallsOnModeChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Modo' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Escuro' }))
    await waitFor(() => expect(args.onModeChange).toHaveBeenCalledWith('dark'))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ThemeCallsOnColorThemeChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Tema' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Stone' }))
    await waitFor(() =>
      expect(args.onColorThemeChange).toHaveBeenCalledWith('stone'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const ThemeListGroupsItsPresets: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Tema' }),
    )
    await expect(await screen.findByText('Cores base')).toBeInTheDocument()
    await expect(screen.getByText('tweakcn')).toBeInTheDocument()
    await expect(
      await screen.findByRole('option', { name: 'Zinc' }),
    ).toBeVisible()
    await expect(
      await screen.findByRole('option', { name: 'Caffeine' }),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const RowsShowTheirValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', { name: 'Modo' }),
    ).toHaveTextContent('Sistema')
    await expect(
      canvas.getByRole('combobox', { name: 'Tema' }),
    ).toHaveTextContent('Default')
  },
}

export const WithoutChangesKeepsValues: Story = {
  args: { withChanges: false },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox', { name: 'Modo' }))
    await userEvent.click(await screen.findByRole('option', { name: 'Escuro' }))
    await expect(
      canvas.getByRole('combobox', { name: 'Modo' }),
    ).toHaveTextContent('Sistema')
    await expect(args.onModeChange).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings4
      colorTheme={settings4Data.colorTheme}
      labels={{
        mode: 'Esquema',
        modeDescription: 'Claro ou escuro',
        theme: 'Paleta',
        title: 'Cores',
      }}
      mode={settings4Data.mode}
      modeOptions={settings4Data.modeOptions}
      onColorThemeChange={args.onColorThemeChange}
      onModeChange={args.onModeChange}
      themeGroups={settings4Data.themeGroups}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Cores')).toBeVisible()
    await expect(
      canvas.getByRole('combobox', { name: 'Esquema' }),
    ).toBeVisible()
    await expect(canvas.getByRole('combobox', { name: 'Paleta' })).toBeVisible()
    await expect(canvas.getByText('Claro ou escuro')).toBeVisible()
    await expect(canvas.queryByText('Aparência')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings4 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando aparência'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings4 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings4 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings4 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando aparência')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
