import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings5 } from '@tc96/ui/blocks/application/settings/settings-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { timeZones, workspace } from '../fixtures/settings-5.ts'
import {
  type Settings5Controls,
  settings5ControlArgs,
} from './settings-5-controls.ts'
import { ComposedSettings5 } from './settings-5-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings5ControlArgs,
    onDeleteWorkspace: fn(),
    onNameCommit: fn(),
    onSlugCommit: fn(),
    onTimeZoneChange: fn(),
    onUploadLogo: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings5/Behavior',
} satisfies Meta<
  Settings5Controls & {
    onDeleteWorkspace: () => void
    onNameCommit: (value: string) => void
    onSlugCommit: (value: string) => void
    onTimeZoneChange: (value: string) => void
    onUploadLogo: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const NameCommitSendsValueOnBlur: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Nome do workspace',
    })
    await userEvent.clear(input)
    await userEvent.type(input, 'Acme Brasil')
    await userEvent.tab()
    await expect(args.onNameCommit).toHaveBeenCalledWith('Acme Brasil')
  },
}

export const SlugCommitSendsValueOnBlur: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'URL do workspace',
    })
    await userEvent.clear(input)
    await userEvent.type(input, 'acme-brasil')
    await userEvent.tab()
    await expect(args.onSlugCommit).toHaveBeenCalledWith('acme-brasil')
  },
}

export const TimeZoneChangeSendsValue: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', { name: 'Fuso horário' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: '(GMT+0) Lisboa' }),
    )
    await waitFor(() =>
      expect(args.onTimeZoneChange).toHaveBeenCalledWith('Europe/Lisbon'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const UploadLogoCallsOnUploadLogo: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar logo' }),
    )
    await expect(args.onUploadLogo).toHaveBeenCalledOnce()
  },
}

export const DeleteWorkspaceCallsOnDeleteWorkspace: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Excluir workspace' }),
    )
    await expect(args.onDeleteWorkspace).toHaveBeenCalledOnce()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings5
      initials={workspace.initials}
      labels={{
        deleteWorkspace: 'Encerrar espaço',
        nameLabel: 'Nome da conta',
        uploadLogo: 'Trocar logo',
        urlLabel: 'Endereço',
        workspaceDescription: (name) => `Equipe de ${name}.`,
        workspaceTitle: 'Espaço',
      }}
      name={workspace.name}
      onDeleteWorkspace={args.onDeleteWorkspace}
      onNameCommit={args.onNameCommit}
      onSlugCommit={args.onSlugCommit}
      onTimeZoneChange={args.onTimeZoneChange}
      onUploadLogo={args.onUploadLogo}
      slug={workspace.slug}
      timeZone={workspace.timeZone}
      timeZones={timeZones}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Espaço')).toBeVisible()
    await expect(canvas.getByText('Equipe de Acme Labs.')).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Nome da conta' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('textbox', { name: 'Endereço' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Trocar logo' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Encerrar espaço' }),
    ).toBeVisible()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings5 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando workspace'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings5 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings5 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings5 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando workspace')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
